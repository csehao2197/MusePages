import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { tracks } from "../content.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rate = 22050;
const length = rate * 18;
await mkdir(path.join(root, "public", "audio"), { recursive: true });

for (const track of tracks)
{
    const data = new Float64Array(length);
    const beat = 60 / track.bpm;
    let seed = track.seed;
    let filtered = 0;
    const random = () =>
    {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        return seed / 4294967296 * 2 - 1;
    };
    for (let i = 0; i < length; i++)
    {
        const t = i / rate;
        const noteIndex = Math.floor(t / beat);
        const local = t % beat;
        const degree = track.motif[noteIndex % track.motif.length];
        const frequency = 440 * 2 ** ((track.root + track.scale[degree] - 69) / 12);
        const phase = 2 * Math.PI * frequency * local;
        const triangle = 2 / Math.PI * Math.asin(Math.sin(phase));
        const piano = (Math.sin(phase) * 0.18 + triangle * 0.06 + Math.sin(phase * 2.003) * 0.022) * Math.exp(-local * 4.7) * Math.min(1, local / 0.008);
        const kickTime = t % (beat * 2);
        const kick = Math.sin(2 * Math.PI * (47 * kickTime + 18 * (1 - Math.exp(-kickTime * 28)) / 28)) * Math.exp(-kickTime * 21) * 0.15;
        const noise = random();
        filtered += (noise - filtered) * 0.2;
        const hatTime = (t + beat / 2) % beat;
        const hat = (noise - filtered) * Math.exp(-hatTime * 115) * 0.026;
        data[i] = piano + kick + hat + noise * 0.0007;
    }
    const seam = Math.floor(rate * 0.016);
    for (let i = 0; i < seam; i++)
    {
        const mix = i / seam;
        const head = data[i];
        const tail = data[length - seam + i];
        data[i] = head * mix + tail * (1 - mix);
        data[length - seam + i] = tail * (1 - mix) + head * mix;
    }
    let peak = 0;
    for (let i = 0; i < length; i++)
    {
        data[i] *= Math.min(1, i / (rate * 0.04), (length - 1 - i) / (rate * 0.04));
        peak = Math.max(peak, Math.abs(data[i]));
    }
    const wav = Buffer.alloc(44 + length * 2);
    wav.write("RIFF", 0);
    wav.writeUInt32LE(wav.length - 8, 4);
    wav.write("WAVEfmt ", 8);
    wav.writeUInt32LE(16, 16);
    wav.writeUInt16LE(1, 20);
    wav.writeUInt16LE(1, 22);
    wav.writeUInt32LE(rate, 24);
    wav.writeUInt32LE(rate * 2, 28);
    wav.writeUInt16LE(2, 32);
    wav.writeUInt16LE(16, 34);
    wav.write("data", 36);
    wav.writeUInt32LE(length * 2, 40);
    for (let i = 0; i < length; i++)
    {
        wav.writeInt16LE(Math.round(data[i] * 0.76 / peak * 32767), 44 + i * 2);
    }
    await writeFile(path.join(root, "public", "audio", `${track.file}.wav`), wav);
}
console.log("Six deterministic original 18-second PCM previews generated.");
