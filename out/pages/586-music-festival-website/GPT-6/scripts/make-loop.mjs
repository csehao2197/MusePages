import { mkdir, writeFile } from "node:fs/promises";
import { mulberry32 } from "../audio.mjs";

const rate = 44100;
const beat = 60 / 124;
const length = Math.round(32 * beat * rate);
const kick = new Float64Array(length);
const music = new Float64Array(length);
const random = mulberry32(7017);
const noiseRandom = mulberry32(1741);
const roots = [110, 87.307, 130.813, 97.999, 110, 87.307, 73.416, 82.407];
const tau = Math.PI * 2;
const saw = phase => 2 * (phase % 1) - 1;
const triangle = phase => 1 - 4 * Math.abs(Math.round(phase) - phase);

function voice(target, start, duration, sample)
{
    const offset = Math.round(start * rate);
    for (let i = 0; i < Math.round(duration * rate); i++) target[(offset + i) % length] += sample(i / rate, i);
}

for (let b = 0; b < 32; b++)
{
    let phase = 0;
    voice(kick, b * beat, .75, t =>
    {
        const frequency = 48 + 82 * Math.max(0, 1 - t / .09) ** 2;
        phase += frequency / rate;
        return Math.sin(tau * phase) * Math.exp(-t / .24) * .95;
    });
    if (b % 4 === 1 || b % 4 === 3)
    {
        let low = 0;
        let high = 0;
        voice(music, b * beat, .5, t =>
        {
            const n = noiseRandom() * 2 - 1;
            low += .12 * (n - low);
            high += .65 * (n - high);
            return (high - low) * Math.exp(-t / .12) * .35;
        });
    }
    let hatLow = 0;
    voice(music, (b + .5) * beat, .18, t =>
    {
        const n = noiseRandom() * 2 - 1;
        hatLow += .35 * (n - hatLow);
        return (n - hatLow) * Math.exp(-t / .035) * .16;
    });
}

for (let bar = 0; bar < 8; bar++)
{
    const root = roots[bar];
    for (let n = 0; n < 8; n++)
    {
        let low = 0;
        voice(music, (bar * 4 + n * .5) * beat, beat * .48, t =>
        {
            low += (1 - Math.exp(-tau * 420 / rate)) * (saw(t * root) - low);
            return low * .42 * Math.min(1, t / .008) * Math.exp(-t / .2);
        });
    }
    const triad = [0, [1, 2, 3, 5, 7].includes(bar) ? 4 : 3, 7];
    let padLow = 0;
    voice(music, bar * 4 * beat, beat * 4 + .4, t =>
    {
        let total = 0;
        for (const note of triad)
        {
            for (const cents of [-7, 0, 7]) total += saw(t * root * 2 ** (note / 12 + cents / 1200)) / 9;
        }
        padLow += (1 - Math.exp(-tau * 1200 / rate)) * (total - padLow);
        const envelope = Math.min(1, t / .3) * Math.min(1, Math.max(0, (beat * 4 + .4 - t) / .4));
        return padLow * .12 * envelope;
    });
    for (let step = 0; step < 16; step++)
    {
        if (random() > .62) continue;
        const pentatonic = [0, 3, 5, 7, 10, 12, 15, 17, 19, 22, 24];
        const frequency = 220 * 2 ** (pentatonic[Math.floor(random() * pentatonic.length)] / 12);
        voice(music, (bar * 4 + step / 4) * beat, .8, t => triangle(t * frequency) * Math.exp(-t / .18) * .22 * Math.min(1, t / .003));
    }
}
const mixed = new Float64Array(length);
let peak = 0;
for (let i = 0; i < length; i++)
{
    const sinceKick = (i / rate) % beat;
    const sidechain = .55 + .45 * (1 - Math.exp(-sinceKick / .12));
    mixed[i] = Math.tanh(1.2 * (kick[i] + music[i] * sidechain));
    peak = Math.max(peak, Math.abs(mixed[i]));
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
for (let i = 0; i < length; i++) wav.writeInt16LE(Math.round(mixed[i] / peak * .89 * 32767), 44 + i * 2);
const output = new URL("../audio/", import.meta.url);
await mkdir(output, { recursive: true });
await writeFile(new URL("loop.wav", output), wav);
console.log(JSON.stringify({ samples: length, sampleRate: rate, channels: 1, duration: length / rate, bytes: wav.length, peak: .89, original: true }));
