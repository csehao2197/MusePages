import { content, flowerGlyph } from "./content.js";
import createElement from "./vendor/lucide/createElement.js";
import HelpCircle from "./vendor/lucide/icons/circle-help.js";
import RotateCcw from "./vendor/lucide/icons/rotate-ccw.js";
import Camera from "./vendor/lucide/icons/camera.js";
import X from "./vendor/lucide/icons/x.js";
import Check from "./vendor/lucide/icons/check.js";
import MousePointer2 from "./vendor/lucide/icons/mouse-pointer-2.js";
import Wind from "./vendor/lucide/icons/wind.js";

const icons = { HelpCircle, RotateCcw, Camera, X, Check, MousePointer2, Wind };
const mark = `<svg class="brandmark" viewBox="0 0 32 32" aria-hidden="true"><g fill="currentColor"><ellipse cx="16" cy="9" rx="4.3" ry="8"/><ellipse cx="23" cy="16" rx="8" ry="4.3"/><ellipse cx="16" cy="23" rx="4.3" ry="8"/><ellipse cx="9" cy="16" rx="8" ry="4.3"/></g><circle cx="16" cy="16" r="3" fill="#ddede6"/></svg>`;
function icon(name)
{
    return `<span data-icon="${name}"></span>`;
}
function credit(className)
{
    return `<a class="${className}" href="${content.credit.url}" target="_blank" rel="noopener noreferrer">${content.credit.label}</a>`;
}

export class UI
{
    constructor(element, state)
    {
        this.state = state;
        element.innerHTML = `
            <section class="stage" id="stage"></section>
            <header class="topbar">
                <div class="wordmark">${mark}<span>${content.brand}</span></div>
                <div class="utilities">
                    <span class="count" id="count">${content.labels.blooms(108)}</span>
                    <button class="icon-button" id="help-open" aria-label="${content.labels.help}" title="${content.labels.help}">${icon("HelpCircle")}</button>
                    <button class="icon-button" id="reset-open" aria-label="${content.labels.reset}" title="${content.labels.reset}">${icon("RotateCcw")}</button>
                </div>
            </header>
            <section class="intro">
                <p class="eyebrow">${content.garden}</p>
                <h1>${content.headline}</h1>
                <p>${content.intro}</p>
            </section>
            <section class="dock-wrap" aria-label="${content.labels.controls}">
                <div class="gesture-hints" aria-hidden="true">
                    <span>${icon("MousePointer2")}${content.labels.hint}</span><i></i>
                    <span>${content.labels.orbit}</span><i></i><span>${content.labels.zoom}</span>
                </div>
                <div class="dock">
                    <div class="flowers" aria-label="${content.labels.choice}">
                        ${content.flowers.map((flower, i) => `<button class="flower" data-flower="${i}" aria-label="${flower.name}" aria-pressed="${i === 0}">${flowerGlyph(i)}<span>${flower.name}</span><kbd>${i + 1}</kbd></button>`).join("")}
                    </div>
                    <div class="weather">
                        <div class="weather-head"><label for="wind">${icon("Wind")}${content.labels.wind}</label><output id="wind-value" for="wind">${content.labels.windValue(35)}</output></div>
                        <input id="wind" type="range" min="0" max="100" step="1" value="35" aria-valuetext="${content.labels.windValue(35)}">
                    </div>
                    <button id="snapshot" class="snapshot" aria-label="${content.labels.snapshot}">${icon("Camera")}<span>${content.labels.snapshot}</span></button>
                </div>
            </section>
            ${credit("credit")}
            <div class="toast" id="toast" role="status" aria-live="polite" aria-atomic="true"></div>
            <dialog id="help-dialog" aria-labelledby="help-title">
                <button class="icon-button dialog-x" id="help-x" aria-label="${content.help.close}">${icon("X")}</button>
                <p class="eyebrow">${content.help.eyebrow}</p>
                <h2 id="help-title">${content.help.title}</h2>
                <ol class="guide-items">${content.help.items.map(([title, body]) => `<li><div><strong>${title}</strong>${body}</div></li>`).join("")}</ol>
                <p class="keyboard-help">${content.help.keyboard}</p>
                <button class="dialog-primary" id="help-close">${content.help.close}</button>
                ${credit("dialog-credit")}
            </dialog>
            <dialog id="reset-dialog" aria-labelledby="reset-title">
                <h2 id="reset-title">${content.reset.title}</h2>
                <p class="reset-copy">${content.reset.body}</p>
                <div class="dialog-actions">
                    <button class="dialog-secondary" id="reset-cancel">${content.reset.cancel}</button>
                    <button class="dialog-primary" id="reset-confirm">${content.labels.reset}</button>
                </div>
            </dialog>`;
        for (const span of element.querySelectorAll("[data-icon]"))
        {
            const svg = createElement(icons[span.dataset.icon]);
            svg.setAttribute("stroke-width", "1.75");
            svg.setAttribute("aria-hidden", "true");
            span.replaceWith(svg);
        }
        this.wind = element.querySelector("#wind");
        this.windValue = element.querySelector("#wind-value");
        this.count = element.querySelector("#count");
        this.buttons = [...element.querySelectorAll("[data-flower]")];
        this.toastElement = element.querySelector("#toast");
        this.help = element.querySelector("#help-dialog");
        this.resetDialog = element.querySelector("#reset-dialog");
        this.buttons.forEach((button, index) => button.addEventListener("click", () => this.select(index)));
        element.querySelector("#help-open").addEventListener("click", () => this.openDialog("help"));
        element.querySelector("#reset-open").addEventListener("click", () => this.openDialog("reset"));
        for (const id of ["help-close", "help-x"])
        {
            element.querySelector(`#${id}`).addEventListener("click", () => this.help.close());
        }
        element.querySelector("#reset-cancel").addEventListener("click", () => this.resetDialog.close());
        element.querySelector("#reset-confirm").addEventListener("click", () =>
        {
            this.garden.reset();
            this.resetDialog.close();
            this.toast(content.toasts.reset);
        });
        for (const [dialog, key] of [[this.help, "helpOpen"], [this.resetDialog, "resetOpen"]])
        {
            dialog.addEventListener("keydown", (event) =>
            {
                if (event.key !== "Tab") return;
                const controls = [...dialog.querySelectorAll("button, a[href], input, [tabindex='0']")]
                    .filter((control) => control.getClientRects().length && !control.disabled);
                const first = controls[0];
                const last = controls.at(-1);
                if ((event.shiftKey && document.activeElement === first) || (!event.shiftKey && document.activeElement === last))
                {
                    event.preventDefault();
                    (event.shiftKey ? last : first).focus();
                }
            });
            dialog.addEventListener("close", () =>
            {
                this.state[key] = false;
                this.opener?.focus();
            });
        }
        this.help.addEventListener("click", (event) =>
        {
            const r = this.help.getBoundingClientRect();
            if (event.target === this.help && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom))
            {
                this.help.close();
            }
        });
        this.wind.addEventListener("input", () => this.garden.setWind(Number(this.wind.value)));
        element.querySelector("#snapshot").addEventListener("click", () => this.garden.snapshot());
    }

    openDialog(type)
    {
        this.opener = document.activeElement;
        this.state[`${type}Open`] = true;
        const dialog = type === "help" ? this.help : this.resetDialog;
        dialog.showModal();
        if (type === "reset") dialog.querySelector("#reset-cancel").focus();
    }

    select(type)
    {
        this.state.selectedFlower = type;
        this.buttons.forEach((button, index) => button.setAttribute("aria-pressed", String(index === type)));
    }

    syncWind()
    {
        this.wind.value = String(this.state.wind);
        const text = content.labels.windValue(this.state.wind);
        this.windValue.textContent = text;
        this.wind.setAttribute("aria-valuetext", text);
    }

    updateCount()
    {
        this.count.textContent = content.labels.blooms(this.state.clumps.length * 6);
    }

    sync()
    {
        this.select(this.state.selectedFlower);
        this.syncWind();
        this.updateCount();
    }

    toast(message)
    {
        clearTimeout(this.toastTimer);
        this.state.toast = message;
        this.toastElement.textContent = message;
        this.toastElement.classList.add("visible");
        this.toastTimer = setTimeout(() =>
        {
            this.state.toast = "";
            this.toastElement.classList.remove("visible");
        }, 2400);
    }
}
