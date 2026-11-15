const params = new URLSearchParams(location.search);
let view = ["signup", "reset"].includes(params.get("view")) ? params.get("view") : "login";
let busy = false;
const auth = document.querySelector("#auth");
const field = (name, label, type, placeholder, toggle = false) => `<div class="field"><label for="${name}">${label}</label><div class="input-wrap">${name === "email" ? '<span aria-hidden="true">＠</span>' : ""}<input id="${name}" name="${name}" type="${type}" placeholder="${placeholder}" autocomplete="${name === "password" ? view === "login" ? "current-password" : "new-password" : name === "confirm" ? "new-password" : name === "fullname" ? "name" : "email"}" required aria-describedby="${name}-error">${toggle ? `<button type="button" data-toggle="${name}" aria-label="Show ${label.toLowerCase()}">Show</button>` : ""}</div><span class="error" id="${name}-error"></span></div>`;
function render()
{
    const signup = view === "signup";
    const reset = view === "reset";
    document.title = `Orbit — ${signup ? "Create your account" : reset ? "Reset your password" : "Welcome back"}`;
    document.querySelector("#form-title").textContent = signup ? "Create your account" : reset ? "Reset your password" : "Welcome back";
    document.querySelector("#form-eyebrow").textContent = signup ? "MAKE ROOM FOR SOMETHING GOOD" : reset ? "LET’S GET YOU BACK IN" : "GOOD TO SEE YOU AGAIN";
    document.querySelector("#form-intro").textContent = signup ? "Your next chapter starts with a little space to create." : reset ? "Enter your email and we’ll send you a reset link." : "Pick up where your next big idea left off.";
    document.querySelector("#top-copy").textContent = signup ? "Already part of the team?" : "New around here?";
    document.querySelector("#top-link").textContent = signup ? "Sign in ↗" : "Create an account ↗";
    document.querySelector("#top-link").href = signup ? "?view=login" : "?view=signup";
    const strength = '<div class="strength" id="strength"><div class="strength-bar"><i></i><i></i><i></i><i></i></div><small id="strength-label" role="status">Use at least 12 characters.</small></div><details class="requirements"><summary>Password requirements</summary><p>Use at least 12 characters, including uppercase, lowercase, a number and a symbol. Choose a unique sample password for this demo.</p></details>';
    document.querySelector("#fields").innerHTML = `${signup ? field("fullname", "Full name", "text", "Alex Morgan") : ""}${field("email", signup ? "Work email" : "Email address", "email", "you@company.com")}${!reset ? field("password", "Password", "password", signup ? "Create a strong password" : "Enter your password", true) : ""}${signup ? strength + field("confirm", "Confirm password", "password", "One more time", true) + '<div class="check terms"><input id="terms" type="checkbox" required aria-describedby="terms-error"><label for="terms">I agree to the <button type="button" data-policy="Terms of Service">Terms of Service</button> and <button type="button" data-policy="Privacy Policy">Privacy Policy</button></label></div><span class="error" id="terms-error"></span>' : !reset ? '<div class="form-options"><label class="check"><input id="remember" type="checkbox">Remember me</label><a href="?view=reset" data-view="reset">Forgot password?</a></div>' : ""}`;
    document.querySelector("#submit").innerHTML = `${signup ? "Create account" : reset ? "Send reset link" : "Sign in"} <span>↗</span>`;
    document.querySelector("#submit").disabled = false;
    document.querySelector("#social").hidden = reset;
    document.querySelector("#success").hidden = true;
    document.querySelector("#form-error").textContent = "";
    document.querySelector("#switch-copy").innerHTML = signup ? 'Already have an account? <a href="?view=login" data-view="login">Sign in</a>' : reset ? '<a href="?view=login" data-view="login">← Back to login</a>' : 'Don’t have an account? <a href="?view=signup" data-view="signup">Sign up</a>';
    if (signup) document.querySelector("#password").addEventListener("input", updateStrength);
}
function updateStrength()
{
    const password = document.querySelector("#password").value;
    const score = [password.length >= 12, /[a-z]/.test(password) && /[A-Z]/.test(password), /\d/.test(password), /[^a-zA-Z0-9]/.test(password)].filter(Boolean).length;
    document.querySelectorAll(".strength-bar i").forEach((bar, index) => bar.style.background = index < score ? ["#d36b75", "#d0a35f", "#acb36c", "#639d7c"][Math.max(0, score - 1)] : "#eee9f4");
    document.querySelector("#strength-label").textContent = `${["Use at least 12 characters.", "Weak — keep going.", "Fair — add more variety.", "Good — one more requirement.", "Strong — all requirements met."][score]}${score && password.length < 12 ? " Add more characters." : ""}`;
}
document.addEventListener("click", (event) =>
{
    const toggle = event.target.closest("[data-toggle]");
    if (toggle)
    {
        const input = document.getElementById(toggle.dataset.toggle);
        input.type = input.type === "password" ? "text" : "password";
        toggle.textContent = input.type === "text" ? "Hide" : "Show";
        toggle.setAttribute("aria-label", `${input.type === "text" ? "Hide" : "Show"} ${input.id === "confirm" ? "confirm password" : "password"}`);
    }
    const link = event.target.closest("[data-view]");
    if (link)
    {
        event.preventDefault();
        if (busy) return;
        view = link.dataset.view;
        history.pushState({ view }, "", `?view=${view}`);
        render();
    }
});
document.querySelector("#top-link").addEventListener("click", (event) =>
{
    event.preventDefault();
    if (busy) return;
    view = view === "signup" ? "login" : "signup";
    history.pushState({ view }, "", `?view=${view}`);
    render();
});
addEventListener("popstate", () =>
{
    const requested = new URLSearchParams(location.search).get("view");
    view = ["signup", "reset"].includes(requested) ? requested : "login";
    if (!busy) render();
});
function error(name, text)
{
    document.getElementById(`${name}-error`).textContent = text;
    document.getElementById(name).setAttribute("aria-invalid", String(Boolean(text)));
}
auth.addEventListener("submit", async (event) =>
{
    event.preventDefault();
    if (busy) return;
    document.querySelectorAll(".error").forEach((element) => element.textContent = "");
    auth.querySelectorAll("[aria-invalid]").forEach((input) => input.removeAttribute("aria-invalid"));
    document.querySelector("#success").hidden = true;
    const email = document.querySelector("#email");
    if (!email.value.trim() || !email.validity.valid) error("email", "Enter a valid email address.");
    if (view === "signup")
    {
        if (document.querySelector("#fullname").value.trim().length < 2) error("fullname", "Enter your full name.");
        const password = document.querySelector("#password").value;
        if (password.length < 12 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password) || !/[^a-zA-Z0-9]/.test(password)) error("password", "Use 12+ characters with uppercase, lowercase, a number and a symbol.");
        if (!document.querySelector("#confirm").value || document.querySelector("#confirm").value !== password) error("confirm", "Passwords must match.");
        if (!document.querySelector("#terms").checked) error("terms", "Please agree to the terms before continuing.");
    }
    else if (view === "login" && !document.querySelector("#password").value) error("password", "Enter your password.");
    const invalid = auth.querySelector('[aria-invalid="true"]');
    if (invalid)
    {
        document.querySelector("#form-error").textContent = "A quick check: please fix the highlighted fields.";
        invalid.focus();
        return;
    }
    document.querySelector("#form-error").textContent = "";
    busy = true;
    const button = document.querySelector("#submit");
    const original = button.innerHTML;
    button.disabled = true;
    button.textContent = view === "reset" ? "Preparing reset link…" : view === "signup" ? "Preparing your workspace…" : "Signing in…";
    await new Promise((resolve) => setTimeout(resolve, 650));
    const success = document.querySelector("#success");
    success.hidden = false;
    success.textContent = view === "reset" ? "Demo reset request prepared. In a real service, a link would be sent if an account exists. No email was sent." : view === "signup" ? "Your demo workspace is ready to preview. No account was created and no password was stored or transmitted." : `Welcome to your local workspace preview. No authentication occurred and no password was stored.${document.querySelector("#remember").checked ? " Remember me was selected for this demo only." : ""}`;
    auth.querySelectorAll('input[type="password"], input[name="password"], input[name="confirm"]').forEach((input) => input.value = "");
    if (view === "signup") updateStrength();
    button.disabled = false;
    button.innerHTML = original;
    busy = false;
});
const dialog = document.querySelector("dialog");
document.addEventListener("click", (event) =>
{
    const provider = event.target.closest("[data-provider]");
    const policy = event.target.closest("[data-policy]");
    if (!provider && !policy) return;
    const name = provider?.dataset.provider || policy.dataset.policy;
    document.querySelector("#dialog-title").textContent = provider ? `Continue with ${name}` : name;
    document.querySelector("#dialog-copy").textContent = provider ? `In the full product, ${name} securely handles sign-in and returns you to Orbit. This demo does not open OAuth, request access or create a session. No credentials are needed.` : name === "Privacy Policy" ? "Demo privacy summary: inputs stay in memory in this browser tab. No analytics, account data, passwords or form contents are transmitted or stored. The full product would provide a reviewed privacy policy." : name === "Terms of Service" ? "Demo terms summary: this is an interactive interface concept, not a live account service. Sample pricing, testimonials and product security principles are illustrative." : "For this demo, support is not connected to a live team. Try the signup and reset flows using sample details; no real messages or reset links are sent.";
    dialog.showModal();
});
document.querySelector("#dialog-action").addEventListener("click", () => dialog.close());
render();
