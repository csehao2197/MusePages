const N = "N";
const I = "I";
const S = "S";
const E = "0";
const rows = (pattern) => pattern.map((row) => row.split(""));

export const levels =
[
    rows([
        "000000000000",
        "0NNNN00NNNN0",
        "00NNNNNNNN00"
    ]),
    rows([
        "NNNNNNNNNNNN",
        "NNNSNNNNSNNN",
        "NNNNNNNNNNNN",
        "NNNNNNNNNNNN"
    ]),
    rows([
        "INNNNNNNNNNI",
        "N0N0N0N0N0N0",
        "0N0S0N0NSN0N",
        "N0N0N0N0N0N0",
        "INNNNNNNNNNI"
    ]),
    rows([
        "00000NN00000",
        "000ISNSNI000",
        "00NNNNNNNN00",
        "0INNSNNSNNI0",
        "00NNNNNNNN00",
        "000INNNNI000",
        "00000NN00000"
    ]),
    rows([
        "INNNNNNNNNNI",
        "IN00S00S00NI",
        "NN0NNNNNN0NN",
        "IN0NNNNNN0NI",
        "NN00S00S00NN",
        "INNNNNNNNNNI"
    ]),
    rows([
        "NNNNINNNINNN",
        "S00NIN00I00S",
        "NNNNINNNINNN",
        "N00S0000S00N",
        "NNINNNNINNNN",
        "S0IN000IN00S",
        "NNINNNNINNNN"
    ]),
    rows([
        "0N0NINNIN0N0",
        "S0N0INNI0N0S",
        "INNNNNNNNNNI",
        "INNSNNNNSNNI",
        "NNNNNNNNNNNN",
        "S0N0INNI0N0S"
    ]),
    rows([
        "INNSINN0INNS",
        "NNINNNSINNNI",
        "SNN0INNSNNNN",
        "NINNSNNINNNS",
        "NNNINNNNINNN",
        "SINNNINNNINN"
    ]),
    rows([
        "INNINNINNINN",
        "NSNNSNNSNNSN",
        "NNINNINNINNI",
        "INNINNINNINN",
        "NSNNSNNSNNSN",
        "NNINNINNINNI"
    ]),
    rows([
        "IINNNNNNNNII",
        "INNSNNNNSNNI",
        "INSNNNNNNSNI",
        "INNNINNINNNI",
        "INSNNNNNNSNI",
        "INNNINNINNNI",
        "INNSNNNNSNNI",
        "00SNNNNNNS00"
    ])
];

export const levelNames =
[
    "First contact", "Chain reaction", "Checkmate", "Diamond dust", "The fortress",
    "Lost in the maze", "Crossfire", "Beautiful chaos", "Critical mass", "The final gauntlet"
];
export const speeds = [1, 1, 1.1, 1.1, 1.2, 1.2, 1.3, 1.3, 1.4, 1.5];
export const brickCodes = { N, I, S, E };

export function createBricks(level)
{
    return levels[level - 1].flatMap((row, y) => row.flatMap((type, x) =>
        type === E ? [] : [{ x: 18 + x * 64, y: 48 + y * 24, w: 60, h: 20, type, alive: true }]));
}
