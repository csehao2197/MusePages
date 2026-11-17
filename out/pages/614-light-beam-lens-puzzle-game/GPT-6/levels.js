import { content } from "./content.js";

const direction = (value) => "NESW".indexOf(value);
const emitter = (x, y, d) => ({ x, y, d: direction(d) });
const target = (x, y, d) => ({ x, y, d: direction(d) });
const mirror = (x, y, slope) => ({ x, y, type: "M", solved: slope === "R" ? 0 : 1 });
const lens = (x, y, axis) => ({ x, y, type: "L", solved: axis === "H" ? 0 : 1 });
const splitter = (x, y, d, initial) => ({ x, y, type: "P", solved: direction(d), initial: direction(initial) });
const definition = (id, size, source, receivers, pieces, targetMoves, blockers = []) =>
({
    id, name: content.names[id - 1], size, emitter: source, receivers, target: targetMoves,
    pieces: pieces.sort((a, b) => a.y - b.y || a.x - b.x).map((piece, index) =>
    ({
        ...piece,
        id: index,
        initial: piece.initial ?? ((piece.solved + 1) % 4)
    })),
    blockers: blockers.map(([x, y]) => ({ x, y }))
});

export const levels =
[
    definition(1, 4, emitter(0, 1, "E"), [target(3, 1, "E")],
        [lens(1, 1, "H")], 1),
    definition(2, 4, emitter(0, 0, "E"), [target(2, 3, "S")],
        [mirror(2, 0, "F")], 1),
    definition(3, 4, emitter(0, 2, "E"), [target(0, 0, "W")],
        [mirror(2, 2, "R"), mirror(2, 0, "F"), lens(1, 2, "H")], 3),
    definition(4, 5, emitter(0, 4, "E"), [target(1, 3, "S")],
        [mirror(4, 4, "R"), mirror(4, 1, "F"), mirror(1, 1, "R"), lens(2, 4, "H")], 4),
    definition(5, 5, emitter(0, 0, "E"), [target(4, 2, "E")],
        [mirror(3, 0, "F"), mirror(3, 4, "R"), mirror(1, 4, "F"), mirror(1, 2, "R"), lens(1, 0, "H"), lens(2, 2, "H")], 6),
    definition(6, 5, emitter(0, 2, "E"), [target(4, 4, "S")],
        [mirror(2, 2, "R"), mirror(2, 0, "R"), mirror(4, 0, "F"), lens(1, 2, "H"), lens(3, 0, "H"), lens(4, 2, "V")], 6, [[0, 0], [1, 4], [3, 3]]),
    definition(7, 6, emitter(0, 5, "E"), [target(4, 3, "E")],
        [mirror(5, 5, "R"), mirror(5, 1, "F"), mirror(3, 1, "F"), mirror(3, 0, "F"), mirror(1, 0, "R"), mirror(1, 3, "F"), lens(2, 5, "H"), lens(2, 3, "H")], 8),
    definition(8, 6, emitter(0, 2, "E"), [target(5, 2, "E"), target(5, 4, "E")],
        [splitter(2, 2, "S", "N"), mirror(2, 4, "F"), lens(4, 2, "H"), lens(4, 4, "H")], 5),
    definition(9, 6, emitter(0, 0, "E"), [target(5, 5, "S"), target(0, 5, "S")],
        [splitter(2, 0, "S", "E"), mirror(5, 0, "F"), mirror(2, 3, "R"), mirror(0, 3, "R"), lens(5, 2, "V"), lens(1, 3, "H")], 6),
    definition(10, 6, emitter(0, 5, "E"), [target(5, 0, "E"), target(3, 4, "W")],
        [splitter(2, 2, "E", "N"), mirror(2, 5, "R"), mirror(2, 0, "R"), mirror(5, 2, "F"), mirror(5, 4, "R"), lens(4, 0, "H"), lens(4, 2, "H"), lens(4, 4, "H")], 8),
    definition(11, 7, emitter(0, 3, "E"), [target(6, 3, "E"), target(0, 0, "W"), target(3, 6, "W")],
        [splitter(2, 3, "N", "E"), splitter(5, 3, "S", "E"), mirror(2, 0, "F"), mirror(5, 6, "R"), lens(4, 3, "H"), lens(2, 1, "V"), lens(4, 6, "H")], 9),
    definition(12, 7, emitter(0, 6, "E"), [target(6, 0, "E"), target(6, 1, "N"), target(2, 6, "W")],
        [splitter(1, 3, "E", "N"), splitter(4, 3, "S", "E"), mirror(1, 6, "R"), mirror(1, 0, "R"), mirror(6, 3, "R"), mirror(4, 6, "R"), lens(1, 4, "V"), lens(3, 0, "H"), lens(5, 3, "H"), lens(3, 6, "H")], 10)
];
