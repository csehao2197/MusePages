export const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
export const lerp = (a, b, t) => a + (b - a) * t;
export const ease = (t) => t * t * (3 - 2 * t);
