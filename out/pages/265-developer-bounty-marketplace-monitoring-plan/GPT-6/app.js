const $ = (id) => document.getElementById(id);
let scenario = "healthy";
let filter = "all";
let acknowledged = false;
let contained = false;
let recovered = false;
let runCount = 0;
const definitions = [
    { name: "Soroban testnet RPC", metric: "142ms · health OK", owner: "kernel → ecosystem status", threshold: "Alert after more than 2 consecutive failed checks.", key: "rpc" },
    { name: "Horizon testnet", metric: "Synced · 0 ledger lag", owner: "kernel → ecosystem status", threshold: "Health and ledger sync remain available.", key: "horizon" },
    { name: "npm registry", metric: "Template version aligned", owner: "stellar-ops", threshold: "Compare latest create-stellar-agentic version.", key: "npm" },
    { name: "Documentation site", metric: "HTTP 200 · sample", owner: "stellar-ops", threshold: "Public documentation returns HTTP 200.", key: "docs" },
    { name: "GitHub / CI", metric: "100% main checks passing", owner: "stellar-ops", threshold: "Main branch CI pass rate must be 100%.", key: "ci" },
    { name: "Forge gateway", metric: "58 catalog entries", owner: "kernel (repo owner)", threshold: "Catalog at least 50 entries; uptime at least 99%.", key: "catalog" },
    { name: "Deployed contracts", metric: "WASM hash matches registry", owner: "stellar-contracts", threshold: "Deployed hash must equal the tracked deployment record.", key: "hash" }
];
const alerts = {
    rpc: { title: "RPC health checks failing", severity: "HIGH", detail: "3 consecutive sample failures exceed the >2 threshold.", channel: "GitHub issue", owner: "kernel → ecosystem status" },
    catalog: { title: "Gateway catalog below floor", severity: "MEDIUM", detail: "49 entries; the minimum expected is 50. Review repository scan paths.", channel: "PR comment", owner: "kernel (repo owner)" },
    hash: { title: "Contract integrity mismatch", severity: "CRITICAL", detail: "Sample deployed WASM hash differs from the registry. Contain deployments and review tracked source.", channel: "GitHub issue + email", owner: "stellar-contracts" },
    eval: { title: "Evaluation pass rate regressed", severity: "MEDIUM", detail: "88% across sample tasks; target is at least 90%. Review routing and replay the failing eval.", channel: "PR comment", owner: "stellar-ops" },
    ci: { title: "Main branch CI is red", severity: "HIGH", detail: "Sample pass rate 90%; main requires 100%. Merge should remain blocked.", channel: "GitHub issue", owner: "stellar-ops" }
};
function render()
{
    const alert = recovered ? null : alerts[scenario];
    const data = definitions.filter((d) => filter === "all" || (alert && d.key === scenario));
    $("systems").innerHTML = data.map((d) => `<button class="system-row" data-detail="${d.key}"><span>${d.name}</span><span>${alert && d.key === scenario ? scenario === "rpc" ? "3 consecutive failures" : scenario === "catalog" ? "49 catalog entries" : scenario === "ci" ? "90% main checks passing" : "WASM hash mismatch" : d.metric}</span><b class="${alert && d.key === scenario ? "bad" : ""}">● ${alert && d.key === scenario ? "ATTENTION" : "HEALTHY"}</b></button>`).join("");
    $("empty").hidden = data.length > 0;
    $("passing").textContent = alert && scenario !== "eval" ? "6 / 7" : "7 / 7";
    $("incident-count").textContent = alert ? "1" : "0";
    $("overall").innerHTML = alert ? "<i></i> ATTENTION REQUIRED" : "<i></i> ALL SYSTEMS NOMINAL";
    $("deploy-status").textContent = `DEPLOYS: LOCAL GATE ${contained ? "PAUSED" : "OPEN"}`;
    $("severity").textContent = alert ? alert.severity : "CLEAR";
    if (alert)
    {
        $("incident-body").innerHTML = `<div class="alert-label">${alert.severity} / ${alert.channel.toUpperCase()}</div><h3>${alert.title}</h3><p>${alert.detail}</p><p>OWNER: ${alert.owner}</p><ol><li>Contain deployments</li><li>Diagnose from logs and tracked records</li><li>Recover from reviewed source</li><li>Append a post-mortem and follow-up</li></ol><button id="ack" ${acknowledged ? "disabled" : ""}>${acknowledged ? "Acknowledged" : "Acknowledge locally"}</button><button id="contain" ${contained ? "disabled" : ""}>${contained ? "Local gate paused" : "Pause local deploy gate"}</button><button id="recover" ${!acknowledged || !contained ? "disabled" : ""}>Record sample recovery</button>`;
    }
    else
    {
        $("incident-body").innerHTML = `<div class="clear-mark">✓</div><h3>${recovered ? "Recovery recorded." : "Quiet is a good signal."}</h3><p>${recovered ? "Local incident resolved. Gate stays paused for a human review; no deployment took place." : "No open alerts in this sample snapshot.<br>Select a scenario to exercise the response workflow."}</p>`;
    }
}
$("run").addEventListener("click", () =>
{
    scenario = $("scenario").value;
    acknowledged = contained = recovered = false;
    runCount++;
    $("last-run").textContent = `LOCAL SAMPLE RUN ${runCount} / NO NETWORK PROBES`;
    $("status").textContent = "Sample checks evaluated locally. No external monitoring performed.";
    render();
});
document.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click", () =>
{
    filter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((tab) => tab.classList.toggle("active", tab === button));
    render();
}));
$("incident-body").addEventListener("click", (event) =>
{
    if (event.target.id === "ack") acknowledged = true;
    if (event.target.id === "contain") contained = true;
    if (event.target.id === "recover" && acknowledged && contained) recovered = true;
    render();
});
$("systems").addEventListener("click", (event) =>
{
    const target = event.target.closest("[data-detail]");
    if (!target) return;
    const item = definitions.find((d) => d.key === target.dataset.detail);
    $("detail-title").textContent = item.name;
    $("detail-body").textContent = `Owner: ${item.owner}\n\nThreshold: ${item.threshold}\n\nSnapshot: ${item.metric}\n\nThis is a deterministic browser sample, not a live service probe.`;
    $("detail").showModal();
});
$("close").addEventListener("click", () => $("detail").close());
$("export").addEventListener("click", () =>
{
    const snapshot = { simulation: true, scenario, runCount, acknowledged, deployGatePaused: contained, recovered, services: definitions, alert: recovered ? null : alerts[scenario] || null };
    const url = URL.createObjectURL(new Blob([JSON.stringify(snapshot, null, 2)], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "stellar-forge-sample-snapshot.json";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    $("status").textContent = "Sample snapshot exported.";
});
render();
