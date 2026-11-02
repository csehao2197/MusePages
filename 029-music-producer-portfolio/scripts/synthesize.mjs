// Original procedural sketches. Built-in Node modules only; no samples or recordings.
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const rate = 22050;
const seconds = 14;
const root = new URL("../public/audio/", import.meta.url);
const tracks = [
  ["midnight-drive", 142, 42, [0, 3, 7, 10]],
  ["no-signal", 148, 36, [0, 3, 7, 12]],
  ["violet-hour", 92, 45, [0, 3, 7, 10]],
  ["after-image", 110, 38, [0, 5, 7, 12]],
  ["southbound", 136, 40, [0, 3, 7, 14]],
  ["blue-room", 86, 47, [0, 3, 7, 10]],
];
const hz = (midi) => 440 * 2 ** ((midi - 69) / 12);
mkdirSync(root, { recursive: true });

for (const [index, [name, bpm, base, chord]] of tracks.entries()) {
  let seed = 2900 + index;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296 * 2 - 1; };
  const beat = 60 / bpm;
  const pcm = Buffer.alloc(44 + rate * seconds * 2);
  pcm.write("RIFF", 0); pcm.writeUInt32LE(pcm.length - 8, 4); pcm.write("WAVEfmt ", 8);
  pcm.writeUInt32LE(16, 16); pcm.writeUInt16LE(1, 20); pcm.writeUInt16LE(1, 22);
  pcm.writeUInt32LE(rate, 24); pcm.writeUInt32LE(rate * 2, 28); pcm.writeUInt16LE(2, 32);
  pcm.writeUInt16LE(16, 34); pcm.write("data", 36); pcm.writeUInt32LE(pcm.length - 44, 40);
  for (let frame = 0; frame < rate * seconds; frame++) {
    const t = frame / rate;
    const step = Math.floor(t / (beat / 2));
    const pulse = t % beat;
    const noteTime = t % (beat / 2);
    const bassNote = base + [0, 0, -5, -2][Math.floor(t / (beat * 4)) % 4];
    const bass = Math.sin(2 * Math.PI * hz(bassNote) * t) * Math.exp(-pulse * 5) * .21;
    const kick = Math.sin(2 * Math.PI * (44 * pulse + 10 * (1 - Math.exp(-pulse * 35)))) * Math.exp(-pulse * 24) * .34;
    const hat = random() * Math.exp(-noteTime * 100) * .055;
    const snare = random() * Math.exp(-((t + beat) % (beat * 2)) * 30) * .105;
    const motif = hz(base + 24 + chord[[0, 2, 1, 3, 2, 1, 0, 3][step % 8]]);
    const melody = (Math.sin(2 * Math.PI * motif * t) + .25 * Math.sin(2 * Math.PI * motif * 2.002 * t)) * Math.exp(-noteTime * 7) * .085;
    const pad = chord.reduce((sum, tone) => sum + Math.sin(2 * Math.PI * hz(base + 12 + tone) * t), 0) * .021;
    const fade = Math.min(1, t / .07, (seconds - t) / .4);
    const value = Math.tanh((bass + kick + hat + snare + melody + pad) * 1.15) * fade * .78;
    pcm.writeInt16LE(Math.round(value * 32767), 44 + frame * 2);
  }
  writeFileSync(new URL(`${name}.wav`, root), pcm);
  console.log(`${name}: ${seconds}s, original PCM synthesis → ${fileURLToPath(root)}`);
}
