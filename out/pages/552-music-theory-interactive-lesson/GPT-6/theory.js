import {content} from "./content.js";

export const DEFAULT_NAMES = ["C", "Db", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];
export const FIFTHS_ORDER = ["C", "G", "D", "A", "E", "B", "F#", "Db", "Ab", "Eb", "Bb", "F"];
export const RELATIVE_MINORS = ["Am", "Em", "Bm", "F#m", "C#m", "G#m", "D#m", "Bbm", "Fm", "Cm", "Gm", "Dm"];
export const PITCH_COLORS = ["#FF5A47", "#29C9FF", "#FFC21F", "#A98BFF", "#8CF23C", "#FF5CB0", "#1FE5C4", "#FF8A2B", "#6FA3FF", "#E6FF2E", "#E872FF", "#2EE87F"];
export const SCALES =
[
    "C D E F G A B", "G A B C D E F#", "D E F# G A B C#", "A B C# D E F# G#",
    "E F# G# A B C# D#", "B C# D# E F# G# A#", "F# G# A# B C# D# E#",
    "Db Eb F Gb Ab Bb C", "Ab Bb C Db Eb F G", "Eb F G Ab Bb C D", "Bb C D Eb F G A", "F G A Bb C D E"
].map((scale) => scale.split(" "));
export const SIGNATURES = ["none", "1 sharp", "2 sharps", "3 sharps", "4 sharps", "5 sharps", "6 sharps", "5 flats", "4 flats", "3 flats", "2 flats", "1 flat"];
export const SIGNATURE_NOTES = ["", "F#", "F# C#", "F# C# G#", "F# C# G# D#", "F# C# G# D# A#", "F# C# G# D# A# E#", "Bb Eb Ab Db Gb", "Bb Eb Ab Db", "Bb Eb Ab", "Bb Eb", "Bb"];
const NATURAL = {C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11};
const LETTERS = ["C", "D", "E", "F", "G", "A", "B"];
export const pc = (value) => ((value % 12) + 12) % 12;
export function pitch(name)
{
    return pc(NATURAL[name[0]] + [...name.slice(1)].reduce((sum, accidental) => sum + (accidental === "#" ? 1 : -1), 0));
}
export const noteName = (midi) => DEFAULT_NAMES[pc(midi)] + (Math.floor(midi / 12) - 1);
export const quality = (id) => content.qualities.find((item) => item.id === id);
export function chord(root, id)
{
    const q = quality(id);
    const rootPc = pitch(root);
    const names = q.degrees.map((degree, i) =>
    {
        const letter = LETTERS[(LETTERS.indexOf(root[0]) + degree - 1) % 7];
        let delta = pc(rootPc + q.steps[i] - NATURAL[letter]);
        if (delta > 6) delta -= 12;
        return letter + (delta > 0 ? "#".repeat(delta) : "b".repeat(-delta));
    });
    return {names, midis: q.steps.map((step) => 60 + rootPc + step), q};
}
export function scaleMidis(index)
{
    const root = 60 + pitch(FIFTHS_ORDER[index]);
    return [0, 2, 4, 5, 7, 9, 11, 12].map((step) => root + step);
}
export function diatonic(index)
{
    return SCALES[index].map((root, i) => ({root, quality: ["major", "minor", "minor", "major", "major", "minor", "diminished"][i], roman: ["I", "ii", "iii", "IV", "V", "vi", "vii"][i]}));
}
export function intervalDescription(first, second)
{
    const distance = Math.abs(second - first);
    if (distance === 0) return content.format.sameNote(noteName(second));
    const reduced = distance > 12 ? distance % 12 || 12 : distance;
    const name = content.intervals[reduced - 1][0].toLowerCase();
    return content.format.distance(noteName(first), noteName(second), name, distance);
}
