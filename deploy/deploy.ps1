<#
.SYNOPSIS
Deploys the root out folder over SCP after backing up the remote website.
.EXAMPLE
.\deploy\deploy.ps1 -WhatIf
.EXAMPLE
.\deploy\deploy.ps1
.EXAMPLE
.\deploy\deploy.ps1 -Server root@203.0.113.10
.EXAMPLE
.\deploy\deploy.ps1 -Server root@203.0.113.10 -PrivateKey C:\Keys\musepages -WhatIf
.NOTES
Install the matching public key in the remote user's authorized_keys first.
The default private key is key\musepages in the repository root.
The default server and login ID are read from deploy\config.json.
The remote user must be able to write to /var/www/mywebsite.com.
Requires OpenSSH locally and a Debian-compatible remote shell and utilities.
#>
[CmdletBinding(SupportsShouldProcess)]
param(
    [ValidatePattern('^[a-zA-Z0-9][a-zA-Z0-9_.@:\[\]-]*$')]
    [string]$Server,

    [string]$PrivateKey = (Join-Path (Split-Path $PSScriptRoot -Parent) 'key\musepages')
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not $Server) {
    $configPath = Join-Path $PSScriptRoot 'config.json'
    $config = Get-Content -LiteralPath $configPath -Raw | ConvertFrom-Json
    if ([string]::IsNullOrWhiteSpace($config.server) -or [string]::IsNullOrWhiteSpace($config.loginId)) {
        throw "Set server and loginId in $configPath, or pass -Server user@host."
    }
    $Server = '{0}@{1}' -f $config.loginId, $config.server
}

$source = Join-Path (Split-Path $PSScriptRoot -Parent) 'out'
if (-not (Test-Path -LiteralPath (Join-Path $source 'index.html') -PathType Leaf)) {
    throw "Deployable website missing: $source\index.html"
}

$id = [guid]::NewGuid().ToString('N')
$target = '/var/www/mywebsite.com/html'
$backup = "/var/www/mywebsite.com/html-backup-$(Get-Date -Format yyyyMMdd-HHmmss)-$id"
$failed = "/var/www/mywebsite.com/html-failed-$id"

if (-not $PSCmdlet.ShouldProcess(
    "$Server`:$target",
    "Back up the live folder to $backup, then upload $source directly to $target"
)) {
    return
}

if (-not (Test-Path -LiteralPath $PrivateKey -PathType Leaf)) {
    throw "SSH private key not found: $PrivateKey"
}
Get-Command scp -ErrorAction Stop | Out-Null
Get-Command ssh -ErrorAction Stop | Out-Null

Write-Host "Backing up ${Server}:$target to $backup"
$backupCommand = "set -eu; test -d '$target'; test ! -e '$backup'; " +
    "mv -T '$target' '$backup'"
& ssh -i $PrivateKey -o IdentitiesOnly=yes $Server $backupCommand
if ($LASTEXITCODE -ne 0) {
    throw "Remote backup failed; upload was not started. Inspect ${Server}:$target and $backup."
}

Write-Host "Uploading $source to ${Server}:$target"
& scp -i $PrivateKey -o IdentitiesOnly=yes -r $source "${Server}:$target"
$deploymentFailed = $LASTEXITCODE -ne 0

if (-not $deploymentFailed) {
    $finishCommand = "set -eu; test -f '$target/index.html'; " +
        "chmod -R u=rwX,go=rX '$target'"
    & ssh -i $PrivateKey -o IdentitiesOnly=yes $Server $finishCommand
    $deploymentFailed = $LASTEXITCODE -ne 0
}

if ($deploymentFailed) {
    Write-Warning 'Deployment failed; attempting to restore the previous website.'
    $restoreCommand = "set -eu; test -d '$backup'; test ! -e '$failed'; " +
        "if test -e '$target'; then mv -T '$target' '$failed'; fi; " +
        "mv -T '$backup' '$target'"
    & ssh -i $PrivateKey -o IdentitiesOnly=yes $Server $restoreCommand
    if ($LASTEXITCODE -ne 0) {
        throw "Deployment and automatic restore failed. Inspect ${Server}:$target, $backup, and $failed immediately."
    }
    throw "Deployment failed; previous website restored. Any incomplete upload is preserved at ${Server}:$failed."
}

Write-Host "Deployed successfully. Backup: ${Server}:$backup"
