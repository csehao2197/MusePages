const $ = (s) => document.querySelector(s);
let devices, next, selected, uses;
const accounts = new Set();
function render()
{
    $("#count").textContent = devices.length;
    $("#nav-count").textContent = devices.length;
    $("#device-list").replaceChildren();
    for (const device of devices)
    {
        const row = document.createElement("article");
        row.className = "device";
        const info = document.createElement("div");
        const title = document.createElement("h3");
        title.textContent = device.name;
        const sub = document.createElement("p");
        sub.textContent = `10.0.0.${device.ip} / Created ${device.date} / Simulated · Not connected`;
        info.append(title, sub);
        const actions = document.createElement("div");
        actions.className = "device-actions";
        const details = document.createElement("button");
        details.textContent = "Sample profile ↗";
        details.onclick = () =>
        {
            selected = device;
            showProfile();
            $("#detail").showModal();
        };
        const remove = document.createElement("button");
        remove.textContent = "Remove";
        remove.onclick = () =>
        {
            devices = devices.filter((d) => d !== device);
            render();
        };
        actions.append(details, remove);
        row.append(info, actions);
        $("#device-list").append(row);
    }
    if (!devices.length) $("#device-list").textContent = "No devices yet. Add one to explore the demo.";
}
function showProfile()
{
    $("#detail-title").textContent = selected.name;
    $("#profile").textContent = `DEMO ONLY — NOT IMPORTABLE\nAddress: 10.0.0.${selected.ip}\nSample token revision: ${selected.revision}\nDNS: 1.1.1.1, 8.8.8.8\nIllustrative route: 0.0.0.0/0\nEndpoint: unconfigured\nReal keys: not generated`;
}
function reset()
{
    devices = [{ name: "Studio MacBook", ip: 2, revision: 1, date: "demo seed" }, { name: "Everyday phone", ip: 3, revision: 1, date: "demo seed" }];
    next = 4;
    uses = 0;
    accounts.clear();
    $("#usage").textContent = "0 / 10 demo uses";
    $("#invite").reset();
    $("#invite-result").textContent = "";
    render();
}
$("#add").onclick = () => $("#device-dialog").showModal();
document.querySelectorAll(".close").forEach((b) => b.onclick = () => b.closest("dialog").close());
$("#device-form").onsubmit = (e) =>
{
    e.preventDefault();
    const name = $("#device-name").value.trim();
    if (!name) return $("#device-name").setCustomValidity("Device name is required");
    devices.push({ name, ip: next++, revision: 1, date: new Date().toLocaleDateString("en-US") });
    render();
    $("#device-form").reset();
    $("#device-dialog").close();
};
$("#device-name").oninput = () => $("#device-name").setCustomValidity("");
$("#regenerate").onclick = () =>
{
    selected.revision++;
    showProfile();
};
$("#download").onclick = () =>
{
    const url = URL.createObjectURL(new Blob([$("#profile").textContent], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "relay-sample-notes.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
};
$("#invite").onsubmit = (e) =>
{
    e.preventDefault();
    const code = $("#code").value.trim().toUpperCase();
    const user = $("#username").value.trim();
    const password = $("#password").value;
    let message;
    if (!code || !user || !password || !$("#confirm").value) message = "All fields are required";
    else if (code === "EXPIRED") message = "Invitation code has expired";
    else if (code === "FULL" || uses >= 10) message = "Invitation code has reached maximum uses";
    else if (!["BETA01", "FRIENDS01", "WELCOME01"].includes(code)) message = "Invalid invitation code";
    else if (accounts.has(user.toLowerCase())) message = "Username already exists";
    else if (password.length < 6) message = "Password must be at least 6 characters";
    else if (password !== $("#confirm").value) message = "Passwords do not match";
    else
    {
        accounts.add(user.toLowerCase());
        if (code === "BETA01") uses++;
        $("#usage").textContent = `${uses} / 10 demo uses`;
        message = `Demo registration accepted for ${user}. No account or authenticated session was created.`;
        $("#password").value = "";
        $("#confirm").value = "";
    }
    $("#invite-result").textContent = message;
};
$("#reset").onclick = reset;
reset();
