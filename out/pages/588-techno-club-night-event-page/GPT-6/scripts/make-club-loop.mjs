import fs from "node:fs";

const rate = 22050;
const bpm = 132;
const beat = 60 / bpm;
const duration = 16 * beat;
const length = Math.round(duration * rate);
const samples = new Float64Array(length);
const notes = [73.41619198, 87.30705786, 65.40639133, 55];
let seed = 39173;
let filtered = 0;
function noise()
{
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296 * 2 - 1;
}
for (let i = 0; i < length; i++)
{
    const t = i / rate;
    const beatNumber = Math.floor(t / beat);
    const k = t % beat;
    const step = t % (beat / 4);
    const kickPhase = 2 * Math.PI * (44 * k + 56 * .034 * (1 - Math.exp(-k / .034)));
    const kick = Math.sin(kickPhase) * Math.exp(-k * 17) * .9;
    const white = noise();
    filtered += .22 * (white - filtered);
    const hat = (white - filtered) * Math.exp(-step * 115) * .14;
    const snare = beatNumber % 4 === 1 || beatNumber % 4 === 3 ? (white - filtered * .5) * Math.exp(-k * 33) * .35 : 0;
    const bassStep = Math.floor(t / (beat / 2));
    const bassTime = t % (beat / 2);
    const frequency = notes[[0, 0, 1, 0, 2, 2, 3, 1][bassStep % 8]];
    const bass = (Math.sin(2 * Math.PI * frequency * bassTime) + .18 * Math.sin(2 * Math.PI * frequency * bassTime * 2)) *
        Math.min(1, bassTime / .008) * Math.exp(-bassTime * 12) * .34;
    samples[i] = Math.tanh((kick + hat + snare + bass) * 1.25);
}
const fade = Math.round(.008 * rate);
let peak = 0;
for (let i = 0; i < length; i++)
{
    samples[i] *= Math.min(1, i / fade, (length - 1 - i) / fade);
    peak = Math.max(peak, Math.abs(samples[i]));
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
const pcmPeak = Math.floor(.7 * 32767);
for (let i = 0; i < length; i++) wav.writeInt16LE(Math.round(samples[i] / peak * pcmPeak), 44 + i * 2);
const destination = new URL("../audio/", import.meta.url);
fs.mkdirSync(destination, { recursive: true });
fs.writeFileSync(new URL("circuit-loop.wav", destination), wav);
console.log(JSON.stringify({ rate, bpm, beats: 16, duration: length / rate, peak: pcmPeak / 32767, bytes: wav.length }));
