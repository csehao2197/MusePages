import fs from "node:fs";
import path from "node:path";
import { spawn, execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.json"), "utf8").replace(/^\uFEFF/, ""));
const selector = process.argv.find((arg) => arg.startsWith("--ids="));
const ids = selector ? new Set(selector.slice(6).split(",").map(Number)) : null;
if (ids && [...ids].some((id) => !Number.isInteger(id) || id < 1 || id > 100)) throw Error("Invalid --ids selector");
const reportPath = path.join(root, "BUILD_REPORT.json");
const prior = fs.existsSync(reportPath) ? JSON.parse(fs.readFileSync(reportPath, "utf8").replace(/^\uFEFF/, "")) : [];
const results = new Map(prior.map((item) => [item.id, item]));
const logs = path.join(root, "validation-logs");
fs.mkdirSync(logs, { recursive: true });
let unsafeShutdown = false;
const persist = () => {
  const temporary = `${reportPath}.tmp`;
  fs.writeFileSync(temporary, JSON.stringify([...results.values()].sort((a, b) => a.id - b.id), null, 2) + "\n");
  fs.renameSync(temporary, reportPath);
};

function stopOwnedTree(pid, birth) {
  if (process.platform !== "win32") return process.kill(pid, "SIGTERM");
  const command = `
$root = Get-CimInstance Win32_Process -Filter "ProcessId = ${pid}";
if (-not $root) { exit };
if ($root.CreationDate.ToUniversalTime().Ticks.ToString() -ne '${birth}') { exit 2 };
function Stop-OwnedTree([int]$processId, [string]$expectedBirth) {
  $current = Get-CimInstance Win32_Process -Filter "ProcessId = $processId";
  if (-not $current -or $current.CreationDate.ToUniversalTime().Ticks.ToString() -ne $expectedBirth) { return };
  $children = @(Get-CimInstance Win32_Process -Filter "ParentProcessId = $processId");
  foreach ($child in $children) { Stop-OwnedTree $child.ProcessId $child.CreationDate.ToUniversalTime().Ticks.ToString() };
  Stop-Process -Id $processId -ErrorAction SilentlyContinue;
};
Stop-OwnedTree ${pid} '${birth}';
$remaining = Get-CimInstance Win32_Process -Filter "ProcessId = ${pid}";
if ($remaining -and $remaining.CreationDate.ToUniversalTime().Ticks.ToString() -eq '${birth}') { exit 3 };`;
  execFileSync("powershell.exe", ["-NoProfile", "-Command", command], { timeout: 30000 });
}

async function run(entry, label, args, cwd) {
  const logPath = path.join(logs, `${String(entry.id).padStart(3, "0")}-${label}.log`);
  const stream = fs.createWriteStream(logPath);
  const started = Date.now();
  const child = spawn(process.execPath, args, {
    cwd, env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let birth = "";
  if (process.platform === "win32" && child.pid) {
    birth = execFileSync("powershell.exe", ["-NoProfile", "-Command",
      `(Get-CimInstance Win32_Process -Filter "ProcessId = ${child.pid}").CreationDate.ToUniversalTime().Ticks.ToString()`],
    { timeout: 15000, encoding: "utf8" }).trim();
  }
  let timedOut = false;
  let bytes = 0;
  for (const output of [child.stdout, child.stderr]) output.on("data", (chunk) => {
    if (bytes < 2_000_000) stream.write(chunk.subarray(0, 2_000_000 - bytes));
    bytes += chunk.length;
  });
  let exitCode;
  try {
    exitCode = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      timedOut = true;
      try { stopOwnedTree(child.pid, birth); } catch (error) {
        unsafeShutdown = true;
        child.stdout.destroy();
        child.stderr.destroy();
        child.unref();
        reject(Error(`Shutdown needs review for PID ${child.pid}: ${error.message}`));
      }
    }, 300000);
    child.once("error", (error) => { clearTimeout(timer); reject(error); });
    child.once("close", (code) => { clearTimeout(timer); resolve(code); });
    });
  } finally {
    await new Promise((resolve) => stream.end(resolve));
  }
  return {
    check: label, command: [process.execPath, ...args], exitCode,
    status: timedOut ? "timed_out" : exitCode === 0 ? "passed" : "failed",
    durationMs: Date.now() - started, log: path.relative(root, logPath),
  };
}

let failed = false;
for (const entry of manifest) {
  if (ids && !ids.has(entry.id)) continue;
  const brief = path.join(root, entry.filename);
  const folder = path.dirname(brief);
  const result = { id: entry.id, title: entry.title, checkedAt: new Date().toISOString(), status: "verifying", checks: [] };
  results.set(entry.id, result);
  persist();
  try {
    const sourceHash = crypto.createHash("sha256").update(fs.readFileSync(brief)).digest("hex").toUpperCase();
    if (sourceHash !== entry.sha256) throw Error("Original brief changed");
    if (!fs.existsSync(path.join(folder, "package.json"))) throw Error("Project not generated yet");
    const checks = [
      ["build", [path.join(root, "node_modules/next/dist/bin/next"), "build", "--webpack"]],
      ["typecheck", [path.join(root, "node_modules/typescript/bin/tsc"), "--noEmit"]],
      ["interactions", [path.join(root, "node_modules/@playwright/test/cli.js"), "test", "--config", path.join(folder, "playwright.config.ts")]],
    ];
    for (const [label, args] of checks) {
      if (label === "interactions" && !fs.existsSync(path.join(folder, "playwright.config.ts"))) throw Error("Missing interaction test configuration");
      const check = await run(entry, label, args, folder);
      result.checks.push(check);
      persist();
      if (check.status !== "passed") throw Error(`${label} ${check.status}; inspect ${check.log}`);
    }
    result.status = "passed";
    console.log(`${String(entry.id).padStart(3, "0")} passed build, typecheck, and interactions`);
  } catch (error) {
    result.status = "blocked";
    result.error = error.message;
    failed = true;
    console.error(`${String(entry.id).padStart(3, "0")} blocked: ${error.message}`);
  }
  persist();
  if (unsafeShutdown) break;
}
if (failed) process.exitCode = 1;
