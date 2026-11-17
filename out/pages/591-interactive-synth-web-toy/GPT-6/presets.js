import { content } from "./content.js";

export const voices = [
    { name: content.voices[0], waves: [["triangle", -7, 1], ["sine", 7, 1]], attack: 0.18, decay: 0.4, sustain: 0.7, release: 0.9, peak: 0.2, cutoff: 1800, q: 0.7, transpose: 0, gate: 1.5, accent: "#19F0FF", secondary: "#FF2BD6" },
    { name: content.voices[1], waves: [["square", 0, 1], ["square", 6, 0.5]], attack: 0.005, decay: 0.12, sustain: 0.45, release: 0.12, peak: 0.16, cutoff: 3600, q: 3, transpose: 0, gate: 0.9, accent: "#FF2BD6", secondary: "#19F0FF" },
    { name: content.voices[2], waves: [["sawtooth", 0, 1], ["sine", -1200, 0.8]], attack: 0.004, decay: 0.18, sustain: 0.5, release: 0.08, peak: 0.3, cutoff: 700, q: 5, transpose: -24, gate: 0.9, accent: "#C8FF2E", secondary: "#FF2BD6" }
];
export const gridNotes = [60, 63, 65, 67, 70, 72, 75, 77];
export const starters = [
    { name: content.patterns[0], grid: "09002000100800201200402000081000", bpm: 112, voice: 1 },
    { name: content.patterns[1], grid: "01010008000104000100100800020400", bpm: 138, voice: 2 },
    { name: content.patterns[2], grid: "290000008000400052000000a4002000", bpm: 76, voice: 0 }
];
export const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
export const noteName = (midi) => `${noteNames[((midi % 12) + 12) % 12]}${Math.floor(midi / 12) - 1}`;
export const codes = ["KeyA", "KeyW", "KeyS", "KeyE", "KeyD", "KeyF", "KeyT", "KeyG", "KeyY", "KeyH", "KeyU", "KeyJ", "KeyK", "KeyO", "KeyL", "KeyP", "Semicolon", "Quote"];
export const hints = ["A", "W", "S", "E", "D", "F", "T", "G", "Y", "H", "U", "J", "K", "O", "L", "P", ";", "'"];
