export const clamp = (x) => Math.max(0, Math.min(1, x));
export const wrap = (t, rr) => ((t % rr) + rr) % rr;

export function timing(rate)
{
    const RR = 60 / rate;
    const Ts = 0.16 + 0.12 * RR;
    const Td = RR - Ts;
    const PR = 0.06 + 0.08 * Math.min(1, RR);
    const Tic = 0.05;
    const Tir = Math.min(0.07, 0.25 * Td);
    const Tf = RR - PR - Ts - Tir;
    return { RR, Ts, Td, PR, Tic, Tir, Tf, bounds: [0, Tic, Ts, Ts + Tir, RR - PR, RR] };
}

export function phaseTime(phase, rate)
{
    const { bounds } = timing(rate);
    return (bounds[phase] + bounds[phase + 1]) / 2;
}

export function signal(t, rate)
{
    const { RR, PR, Ts } = timing(rate);
    const x = wrap(t + RR / 2, RR) - RR / 2;
    const gaussian = (A, c, s) => A * Math.exp(-((x - c) ** 2) / (2 * s * s));
    return gaussian(0.15, -PR, 0.025) + gaussian(-0.12, -0.025, 0.009) +
        gaussian(1, 0, 0.011) + gaussian(-0.22, 0.028, 0.011) + gaussian(0.30, Ts - 0.05, 0.045);
}

export function model(t, rate)
{
    const timingValues = timing(rate);
    const { RR, Ts, PR, Tic, Tir, Tf, bounds } = timingValues;
    const p = wrap(t, RR);
    const phase = Math.min(4, bounds.slice(1).findIndex((end) => p < end));
    const x = clamp((p - bounds[phase]) / (bounds[phase + 1] - bounds[phase]));
    const F = 0.74 + 0.22 * (1 - Math.exp(-Tf / 0.05));
    const E = F + 0.04;
    const ease = x * x * (3 - 2 * x);
    let v = E;
    if (phase === 1) v = E + (0.74 - E) * ease;
    if (phase === 2) v = 0.74;
    if (phase === 3) v = 0.74 + 0.22 * (1 - Math.exp(-(p - Ts - Tir) / 0.05));
    if (phase === 4) v = F + 0.04 * (1 - (1 - x) ** 2);
    const a = phase === 4 ? 1 - 0.12 * Math.sin(Math.PI * x) : 1;
    let inlet = 0;
    let outlet = 0;
    if (phase === 0) inlet = 1 - clamp(p / 0.03);
    if (phase === 3) inlet = clamp((p - Ts - Tir) / Math.min(0.04, Tf));
    if (phase === 4) inlet = 1;
    if (phase === 1) outlet = clamp((p - Tic) / 0.03);
    if (phase === 2) outlet = 1 - clamp((p - Ts) / Math.min(0.03, Tir));
    const wrapped = wrap(t + RR / 2, RR) - RR / 2;
    const atrialSpark = (wrapped + PR + 0.02) / 0.08;
    const septalSpark = (wrapped + 0.03) / 0.07;
    let mark = -1;
    if (Math.abs(wrapped + PR) < 0.04) mark = 0;
    if (wrapped >= -0.04 && wrapped <= 0.05) mark = 1;
    if (Math.abs(wrapped - (Ts - 0.05)) < 0.05) mark = 2;
    return { ...timingValues, t: p, phase, v, a, inlet, outlet, atrialSpark, septalSpark, mark };
}

export function valveGeometry(cx, cy, angle, halfWidth, openness)
{
    const r = angle * Math.PI / 180;
    const flow = [Math.cos(r), Math.sin(r)];
    const perpendicular = [-flow[1], flow[0]];
    return [-1, 1].map((side) =>
    {
        const hinge = [cx + perpendicular[0] * halfWidth * side, cy + perpendicular[1] * halfWidth * side];
        const theta = (Math.PI / 2) * 0.87 * openness;
        const direction = [-side * perpendicular[0] * Math.cos(theta) + flow[0] * Math.sin(theta),
            -side * perpendicular[1] * Math.cos(theta) + flow[1] * Math.sin(theta)];
        const end = [hinge[0] + direction[0] * halfWidth * 1.04, hinge[1] + direction[1] * halfWidth * 1.04];
        const middle = [(hinge[0] + end[0]) / 2 + flow[0] * 6, (hinge[1] + end[1]) / 2 + flow[1] * 6];
        return { hinge, d: `M${hinge} Q${middle} ${end}` };
    });
}
