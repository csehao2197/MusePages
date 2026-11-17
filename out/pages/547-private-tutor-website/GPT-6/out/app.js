import { content, levelCards } from "./content.js";

const $ = (selector) => document.querySelector(selector);
const ui = content.ui;
const form = $("#booking-form");
const storageKey = "mara-ellison-latest-booking";
let activeSubject = "Mathematics";
let week = 0;
let selectedDate = "";
let selectedTime = "";
let storageAvailable = true;
let latestSummary = "";
const arrowIcon = $(".level-card .text-button svg")?.outerHTML || "";

function escapeText(value)
{
    return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

function localNow()
{
    const parts = new Intl.DateTimeFormat("en-CA", { timeZone: content.timezone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
    const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    return { date: `${value.year}-${value.month}-${value.day}`, time: `${value.hour}:${value.minute}` };
}

const today = localNow().date;
const dayDate = (date) => new Date(`${date}T12:00:00Z`);
function addDays(date, amount)
{
    const next = dayDate(date);
    next.setUTCDate(next.getUTCDate() + amount);
    return next.toISOString().slice(0, 10);
}
const lastDate = addDays(today, 28);
const fullDate = (date) => new Intl.DateTimeFormat("en-US", { timeZone: "UTC", weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(dayDate(date));
const shortDate = (date) => new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "short", day: "numeric" }).format(dayDate(date));
const displayTime = (time) => new Intl.DateTimeFormat("en-US", { timeZone: "UTC", hour: "numeric", minute: "2-digit" }).format(new Date(`2000-01-01T${time}:00Z`));

function timesFor(date)
{
    if (date < today || date > lastDate) return [];
    const weekday = dayDate(date).getUTCDay();
    const times = weekday === 6 ? ["09:00", "10:00", "11:00"] : [2, 4].includes(weekday) ? ["16:00", "17:00", "18:00"] : [];
    const now = localNow();
    return times.filter((time) => date > now.date || (date === now.date && time > now.time));
}

function validSlot()
{
    return selectedDate && timesFor(selectedDate).includes(selectedTime);
}

function draft()
{
    return { ...Object.fromEntries(new FormData(form)), date: selectedDate, time: selectedTime };
}

function saveDraft()
{
    try
    {
        localStorage.setItem(storageKey, JSON.stringify(draft()));
        return true;
    }
    catch
    {
        storageAvailable = false;
        $("#draft-status").textContent = ui.storageUnavailable;
        return false;
    }
}

function setSubject(subject, focus = false)
{
    activeSubject = subject;
    document.querySelectorAll("[data-subject]").forEach((tab, index) =>
    {
        const selected = tab.dataset.subject === subject;
        tab.setAttribute("aria-selected", String(selected));
        tab.tabIndex = selected ? 0 : -1;
        if (selected)
        {
            $("#level-panel").setAttribute("aria-labelledby", `tab-${index}`);
            if (focus) tab.focus();
        }
    });
    $("#level-panel").innerHTML = levelCards(subject);
    $("#level-panel").querySelectorAll('[data-icon="ArrowUpRight"]').forEach((icon) => icon.innerHTML = arrowIcon);
    $("#level-panel").classList.remove("panel-enter");
    void $("#level-panel").offsetWidth;
    $("#level-panel").classList.add("panel-enter");
}

document.querySelectorAll("[data-subject]").forEach((tab, index) =>
{
    tab.addEventListener("click", () => setSubject(tab.dataset.subject));
    tab.addEventListener("keydown", (event) =>
    {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === "Home" ? 0 : event.key === "End" ? content.subjects.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + content.subjects.length) % content.subjects.length;
        setSubject(content.subjects[next], true);
    });
});

$("#level-panel").addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-level]");
    if (!button) return;
    $("#subject").value = activeSubject;
    $("#level").value = content.levels[activeSubject][Number(button.dataset.level)][0];
    $("#subject").classList.remove("field-highlight");
    void $("#subject").offsetWidth;
    $("#subject").classList.add("field-highlight");
    $("#availability").scrollIntoView();
    $("#subject").focus({ preventScroll: true });
    saveDraft();
});
document.querySelectorAll("[data-package]").forEach((button) => button.addEventListener("click", () =>
{
    $("#package").value = button.dataset.package;
    $("#availability").scrollIntoView();
    $("#package").focus({ preventScroll: true });
    saveDraft();
}));

const menuButton = $(".menu-button");
function closeMenu()
{
    menuButton.setAttribute("aria-expanded", "false");
    $("#mobile-nav").hidden = true;
}
menuButton.addEventListener("click", () =>
{
    const expanded = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(expanded));
    $("#mobile-nav").hidden = !expanded;
});
$("#mobile-nav").addEventListener("click", (event) =>
{
    if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) =>
{
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true")
    {
        closeMenu();
        menuButton.focus();
    }
});

function renderCalendar()
{
    const start = addDays(today, week * 7);
    const end = addDays(start, 6);
    $("#week-label").textContent = `${shortDate(start)} – ${shortDate(end)}`;
    $("#prev-week").disabled = week === 0;
    $("#next-week").disabled = week === 4;
    $("#calendar-days").innerHTML = Array.from({ length: 7 }, (_, index) =>
    {
        const date = addDays(start, index);
        const available = timesFor(date).length > 0;
        return `<div class="day-column"><span>${ui.weekdays[dayDate(date).getUTCDay()]}</span><button class="day-button" data-date="${date}" ${available ? "" : "disabled"} aria-label="${fullDate(date)}${available ? ", sample times available" : ", unavailable"}" aria-pressed="${date === selectedDate}"><span>${dayDate(date).getUTCDate()}</span>${available ? "<i aria-hidden=\"true\"></i>" : ""}</button></div>`;
    }).join("");
}

function renderSlots()
{
    const times = selectedDate ? timesFor(selectedDate) : [];
    $("#slots").innerHTML = selectedDate ? `<p>${fullDate(selectedDate)} · ${times.length ? ui.chooseTime : ui.noTimes}</p><div class="time-buttons">${times.map((time) => `<button class="time-button" data-time="${time}" aria-pressed="${time === selectedTime}">${displayTime(time)}</button>`).join("")}</div>` : `<p>${ui.chooseDate}</p>`;
    $("#slot-summary").innerHTML = validSlot() ? `<strong>${fullDate(selectedDate)}</strong><p>${displayTime(selectedTime)} · ${ui.duration}<br>${ui.localTime}</p><button class="text-button" id="change-time">${ui.change}</button>` : "";
}
$("#prev-week").addEventListener("click", () =>
{
    if (week > 0) week--;
    renderCalendar();
});
$("#next-week").addEventListener("click", () =>
{
    if (week < 4) week++;
    renderCalendar();
});
$("#calendar-days").addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-date]");
    if (!button || button.disabled) return;
    selectedDate = button.dataset.date;
    selectedTime = "";
    renderCalendar();
    renderSlots();

    if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches)
    {
        const observer = new IntersectionObserver((entries) =>
        {
            entries.forEach((entry) =>
            {
                if (!entry.isIntersecting) return;
                entry.target.animate([{ opacity: 0, transform: "translateY(22px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 500, easing: "ease-out" });
                observer.unobserve(entry.target);
            });
        }, { threshold: .12 });
        document.querySelectorAll(".section-heading, .three-grid, .portrait, .steps").forEach((section) => observer.observe(section));
    }
    $(`[data-date="${selectedDate}"]`).focus();
    saveDraft();
});
$("#slots").addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-time]");
    if (!button) return;
    selectedTime = button.dataset.time;
    renderSlots();
    $(`[data-time="${selectedTime}"]`).focus();
    saveDraft();
});
$("#slot-summary").addEventListener("click", (event) =>
{
    if (event.target.id !== "change-time") return;
    selectedTime = "";
    renderSlots();
    $("#slots button")?.focus();
    saveDraft();
});
form.addEventListener("input", saveDraft);
form.addEventListener("change", saveDraft);

function clearErrors()
{
    $("#form-errors").textContent = "";
    document.querySelectorAll("small[id$='-error']").forEach((error) => error.textContent = "");
    form.querySelectorAll("[aria-invalid]").forEach((field) => field.removeAttribute("aria-invalid"));
}

function summary(data)
{
    return `${content.brand}\nFree intro request — browser-only demo\n${fullDate(selectedDate)} at ${displayTime(selectedTime)} (${content.timezone}), ${ui.duration}\n${data.name}\n${data.email}\n${data.subject} · ${data.level}\n${data.format} · ${data.package}\n${data.goals}\n${ui.notSent}`;
}

form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    clearErrors();
    const data = draft();
    const errors = [];
    function error(field, message)
    {
        $(`#${field}-error`).textContent = message;
        const input = form.elements.namedItem(field);
        if (input instanceof Element)
        {
            input.setAttribute("aria-invalid", "true");
            input.setAttribute("aria-describedby", `${field}-error`);
        }
        else form.querySelectorAll(`[name="${field}"]`).forEach((radio) =>
        {
            radio.setAttribute("aria-invalid", "true");
            radio.setAttribute("aria-describedby", `${field}-error`);
        });
        errors.push(message);
    }
    if (!validSlot()) errors.push(ui.slotError);
    if (!data.name.trim()) error("name", ui.name);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email.trim())) error("email", ui.email);
    for (const field of ["level", "subject", "format", "package"])
    {
        if (!data[field]) error(field, ui.required);
    }
    if (data.goals.trim().length < 20) error("goals", ui.goals);
    if (errors.length)
    {
        $("#form-errors").textContent = `${ui.errorHeading} ${!validSlot() ? ui.slotError : ""}`;
        $("#form-errors").focus();
        return;
    }
    if (!saveDraft())
    {
        $("#form-errors").textContent = ui.storageUnavailable;
        $("#form-errors").focus();
        return;
    }
    latestSummary = summary(data);
    form.hidden = true;
    const success = $("#success-panel");
    success.hidden = false;
    success.innerHTML = `<h3 tabindex="-1" id="success-heading">${escapeText(ui.success(data.name.trim().split(/\s+/)[0]))}</h3><p>${ui.notSent}</p><pre>${escapeText(latestSummary)}</pre><div class="success-actions"><button class="button" id="copy-request">${ui.copy}</button><button class="button secondary" id="edit-request">${ui.edit}</button><button class="text-button" id="reset-request">${ui.reset}</button></div><p id="copy-status" role="status"></p><textarea id="copy-fallback" readonly aria-label="Request summary to copy" hidden></textarea>`;
    $("#success-heading").focus();
});
$("#success-panel").addEventListener("click", async (event) =>
{
    if (event.target.id === "copy-request")
    {
        try
        {
            await navigator.clipboard.writeText(latestSummary);
            $("#copy-status").textContent = ui.copied;
        }
        catch
        {
            const fallback = $("#copy-fallback");
            fallback.hidden = false;
            fallback.value = latestSummary;
            fallback.focus();
            fallback.select();
            $("#copy-status").textContent = ui.fallback;
        }
    }
    if (["edit-request", "reset-request"].includes(event.target.id))
    {
        if (event.target.id === "reset-request")
        {
            form.reset();
            selectedDate = "";
            selectedTime = "";
            week = 0;
            latestSummary = "";
            try { localStorage.removeItem(storageKey); } catch { storageAvailable = false; }
            renderCalendar();
            renderSlots();
        }
        $("#success-panel").hidden = true;
        form.hidden = false;
        clearErrors();
        $("#name").focus();
    }
});

document.querySelectorAll(".faq button").forEach((button) => button.addEventListener("click", () =>
{
    const open = button.getAttribute("aria-expanded") === "true";
    document.querySelectorAll(".faq button").forEach((other) =>
    {
        other.setAttribute("aria-expanded", "false");
        document.getElementById(other.getAttribute("aria-controls")).hidden = true;
    });
    button.setAttribute("aria-expanded", String(!open));
    document.getElementById(button.getAttribute("aria-controls")).hidden = open;
}));

try
{
    const stored = localStorage.getItem(storageKey);
    if (stored)
    {
        const data = JSON.parse(stored);
        for (const field of ["name", "email", "level", "subject", "package", "goals"])
        {
            if (typeof data[field] === "string") form.elements.namedItem(field).value = data[field];
        }
        const radio = [...form.querySelectorAll('[name="format"]')].find((input) => input.value === data.format);
        if (radio) radio.checked = true;
        if (/^\d{4}-\d{2}-\d{2}$/.test(data.date) && timesFor(data.date).includes(data.time))
        {
            selectedDate = data.date;
            selectedTime = data.time;
            week = Math.floor((dayDate(selectedDate) - dayDate(today)) / 86400000 / 7);
        }
        $("#draft-status").textContent = ui.saved;
    }
}
catch
{
    storageAvailable = false;
    $("#draft-status").textContent = ui.storageUnavailable;
}
renderCalendar();
renderSlots();
