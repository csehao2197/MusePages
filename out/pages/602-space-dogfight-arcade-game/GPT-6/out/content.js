export const BRAND = "Cinder Patrol";
export const CALLSIGN = "Kestrel";
export const SECTOR = "Harrow Reach";
export const FOE = "Glass Moths";
export const CRAFT = "Lark";
export const AUDIENCE = "A short patrol for night-shift pilots.";
export const COPY =
{
    title: BRAND,
    sector: SECTOR.toUpperCase(),
    deck: `Patrol ${SECTOR}. Scatter the ${FOE}.`,
    meta: `Craft ${CRAFT} · Call sign ${CALLSIGN}`,
    retry: `The ${FOE} still hold ${SECTOR}.`,
    retryEyebrow: `${CALLSIGN.toUpperCase()} · ${SECTOR.toUpperCase()}`,
    craft: `${CRAFT.toUpperCase()} / ${CALLSIGN.toUpperCase()}`
};
