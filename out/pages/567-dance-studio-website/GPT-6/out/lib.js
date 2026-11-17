import { studio, sessions, programs, ages, levels } from "./content.js";

export function escapeHtml(value)
{
    return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
}

export function endTime(session)
{
    const [hour, minute] = session.start.split(":").map(Number);
    const total = hour * 60 + minute + session.duration;
    return `${String(Math.floor(total / 60) % 24).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

export function spotsLabel(session)
{
    const free = session.capacity - session.booked;
    return free === 0 ? "Full" : `${free <= 3 ? "Only " : ""}${free} spots`;
}

export function isTrialEligible(session)
{
    return Boolean(session && ["first-class", "beginner"].includes(session.level) && session.booked < session.capacity);
}

export function parseFilters(search)
{
    const query = new URLSearchParams(search);
    return {
        style: programs.some((program) => program.slug === query.get("style")) ? query.get("style") : "",
        age: Object.hasOwn(ages, query.get("age")) ? query.get("age") : "",
        level: Object.hasOwn(levels, query.get("level")) ? query.get("level") : ""
    };
}

export function filteredSessions(filters)
{
    return sessions.filter((session) => (!filters.style || session.style === filters.style) &&
        (!filters.age || session.ageBand === filters.age) && (!filters.level || session.level === filters.level));
}

export function groupedByDay(list)
{
    return Array.from({length: 7}, (_, day) => list.filter((session) => session.day === day));
}

const recitalTime = Date.parse(studio.recital);
export function countdown(now = Date.now())
{
    const seconds = Math.max(0, Math.floor((recitalTime - now) / 1000));
    return [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60];
}

export function eventTime()
{
    const offset = studio.recital.slice(-6);
    const signedMinutes = (offset[0] === "-" ? -1 : 1) * (Number(offset.slice(1, 3)) * 60 + Number(offset.slice(4, 6)));
    const eventWallClock = new Date(recitalTime + signedMinutes * 60000);
    const date = new Intl.DateTimeFormat("en-US", {weekday: "long", month: "long", day: "numeric", timeZone: "UTC"}).format(eventWallClock);
    const time = new Intl.DateTimeFormat("en-US", {hour: "numeric", minute: "2-digit", timeZone: "UTC"}).format(eventWallClock);
    return `${date} · ${time} ${offset === "-05:00" ? "CDT" : `UTC${offset}`}`;
}

export const storage =
{
    get()
    {
        try
        {
            const value = JSON.parse(localStorage.getItem(`${studio.brandSlug}:trial`));
            const session = sessions.find((item) => item.id === value?.sessionId);
            return isTrialEligible(session) && /^OD-\d{4}$/.test(value.id) &&
                typeof value.name === "string" && value.name.trim().length >= 2 &&
                value.name.length <= 40 && Number.isFinite(Date.parse(value.created)) ? value : null;
        }
        catch
        {
            return null;
        }
    },
    set(value)
    {
        try
        {
            localStorage.setItem(`${studio.brandSlug}:trial`, JSON.stringify(value));
            return true;
        }
        catch
        {
            return false;
        }
    },
    remove()
    {
        try
        {
            localStorage.removeItem(`${studio.brandSlug}:trial`);
            return true;
        }
        catch
        {
            return false;
        }
    }
};

export function reservationId(session, email)
{
    const seed = `${session.id}${email.trim().toLowerCase()}`;
    let hash = 0;
    for (const character of seed) hash = ((hash * 31) + character.charCodeAt(0)) >>> 0;
    return `${studio.prefix}-${String(hash % 10000).padStart(4, "0")}`;
}

export function validate(data)
{
    const errors = [];
    const session = sessions.find((item) => item.id === data.get("session"));
    const length = (name) => String(data.get(name) || "").trim().length;
    if (length("name") < 2 || length("name") > 40) errors.push("name");
    if (session && session.ageBand !== "adult" && (length("guardian") < 2 || length("guardian") > 80)) errors.push("guardian");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.get("email") || "").trim())) errors.push("email");
    if (!isTrialEligible(session)) errors.push("session");
    if (!["Brand new", "A few classes", "Returning after a break"].includes(data.get("experience"))) errors.push("experience");
    if (length("notes") > 240) errors.push("notes");
    if (!data.get("consent")) errors.push("consent");
    return errors;
}
