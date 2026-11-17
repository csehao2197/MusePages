export const steps = [[0, -1], [1, 0], [0, 1], [-1, 0]];

export function traceBeam(level, rotations)
{
    const pieces = new Map(level.pieces.map((piece) => [`${piece.x},${piece.y}`, piece]));
    const targets = new Map(level.receivers.map((receiver, index) => [`${receiver.x},${receiver.y}`, { ...receiver, index }]));
    const blockers = new Set(level.blockers.map((blocker) => `${blocker.x},${blocker.y}`));
    const queue = [{ ...level.emitter }];
    const visited = new Set();
    const lit = new Set();
    const segments = [];
    for (let cursor = 0; cursor < queue.length && visited.size < 2048; cursor++)
    {
        const ray = queue[cursor];
        const [dx, dy] = steps[ray.d];
        const next = { x: ray.x + dx, y: ray.y + dy, d: ray.d };
        if (next.x < 0 || next.y < 0 || next.x >= level.size || next.y >= level.size)
        {
            segments.push({ from: ray, to: { x: ray.x + dx * 0.48, y: ray.y + dy * 0.48 } });
            continue;
        }
        const key = `${next.x},${next.y}`;
        const visit = `${key},${next.d}`;
        if (visited.has(visit)) continue;
        visited.add(visit);
        segments.push({ from: ray, to: next });
        if (blockers.has(key)) continue;
        const receiver = targets.get(key);
        if (receiver)
        {
            if (receiver.d === next.d) lit.add(receiver.index);
            continue;
        }
        const piece = pieces.get(key);
        if (!piece)
        {
            queue.push(next);
            continue;
        }
        const rotation = rotations[piece.id];
        if (piece.type === "M")
        {
            next.d = (rotation % 2 === 0 ? [1, 0, 3, 2] : [3, 2, 1, 0])[next.d];
            queue.push(next);
        }
        else if (piece.type === "L")
        {
            if (next.d % 2 !== rotation % 2) queue.push(next);
        }
        else
        {
            queue.push(next);
            if (rotation !== next.d) queue.push({ ...next, d: rotation });
        }
    }
    return { segments, lit: [...lit].sort(), solved: lit.size === level.receivers.length, visits: visited.size, capped: visited.size >= 2048 };
}
