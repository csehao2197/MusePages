import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const sampleRate = 44100;
const seconds = 12;
const count = sampleRate * seconds;
const samples = new Float64Array(count);
const notes = [220, 261.6256, 329.6276, 391.9954, 440, 391.9954, 329.6276, 261.6256];
let seed = 620731;
let filteredNoise = 0;

for (let index = 0; index < count; index++)
{
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    filteredNoise += (((seed / 4294967296) * 2 - 1) - filteredNoise) * 0.035;
    samples[index] = filteredNoise * 0.025;
}

for (let note = 0; note < 32; note++)
{
    const offset = Math.round(note * 0.375 * sampleRate);
    const frequency = notes[note % notes.length] * (note % 8 > 3 ? 0.5 : 1);
    for (let index = 0; index < sampleRate * 2; index++)
    {
        const t = index / sampleRate;
        const attack = Math.min(1, t / 0.005);
        const amplitude = Math.exp(-t * 5) * attack * 0.25;
        samples[(offset + index) % count] += Math.sin(2 * Math.PI * frequency * t) * amplitude;
    }
}

for (let beat = 0; beat < 16; beat++)
{
    const offset = Math.round(beat * 0.75 * sampleRate);
    for (let index = 0; index < sampleRate * 0.35; index++)
    {
        const t = index / sampleRate;
        const phase = 2 * Math.PI * (48 * t + 38 * (1 - Math.exp(-22 * t)) / 22);
        samples[(offset + index) % count] += Math.sin(phase) * Math.exp(-t * 19) * Math.min(1, t / 0.003) * 0.28;
    }
}

// Blend the periodic synthesis seam over a short inaudible noise-only boundary.
const seam = 128;
for (let index = 0; index < seam; index++)
{
    const average = (samples[index] + samples[count - seam + index]) / 2;
    const mix = index / (seam - 1);
    samples[index] = average * (1 - mix) + samples[index] * mix;
    samples[count - seam + index] = samples[count - seam + index] * (1 - mix) + average * mix;
}
const edge = (samples[0] + samples[count - 1]) / 2;
samples[0] = edge;
samples[count - 1] = edge;
const wav = Buffer.alloc(44 + count * 2);
wav.write("RIFF", 0);
wav.writeUInt32LE(wav.length - 8, 4);
wav.write("WAVEfmt ", 8);
wav.writeUInt32LE(16, 16);
wav.writeUInt16LE(1, 20);
wav.writeUInt16LE(1, 22);
wav.writeUInt32LE(sampleRate, 24);
wav.writeUInt32LE(sampleRate * 2, 28);
wav.writeUInt16LE(2, 32);
wav.writeUInt16LE(16, 34);
wav.write("data", 36);
wav.writeUInt32LE(count * 2, 40);
for (let index = 0; index < count; index++)
{
    wav.writeInt16LE(Math.round(Math.max(-1, Math.min(1, samples[index])) * 32767), 44 + index * 2);
}
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
await mkdir(path.join(root, "audio"), { recursive: true });
await writeFile(path.join(root, "audio", "sample-loop.wav"), wav);
console.log(JSON.stringify({ file: "audio\\sample-loop.wav", sampleRate, seconds, channels: 1, bytes: wav.length, thirdPartyAudio: false }));
