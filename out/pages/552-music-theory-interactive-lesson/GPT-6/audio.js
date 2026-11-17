let context;
let master;
let filter;
let muted = false;
let report = () => {};
let nextId = 0;
const voices = new Map();
const jobs = new Set();

export function setReporter(callback)
{
    report = callback;
}
export function unlock()
{
    if (!context)
    {
        context = new AudioContext();
        filter = context.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 3200;
        filter.Q.value = 0.6;
        master = context.createGain();
        master.gain.value = muted ? 0 : 0.7;
        const compressor = context.createDynamicsCompressor();
        filter.connect(master).connect(compressor).connect(context.destination);
    }
    if (context.state === "suspended") context.resume();
}
export function mute(value)
{
    muted = value;
    if (!context) return;
    master.gain.cancelScheduledValues(context.currentTime);
    master.gain.setValueAtTime(master.gain.value, context.currentTime);
    master.gain.linearRampToValueAtTime(value ? 0 : 0.7, context.currentTime + 0.02);
}
export function noteOn(midi, silent = false, peak = 0.5)
{
    if (!context) return null;
    if (voices.size >= 10) noteOff(voices.keys().next().value);
    const id = ++nextId;
    const time = context.currentTime;
    const envelope = context.createGain();
    const triangle = context.createOscillator();
    const sine = context.createOscillator();
    const overtone = context.createGain();
    const frequency = 440 * 2 ** ((midi - 69) / 12);
    triangle.type = "triangle";
    triangle.frequency.value = frequency;
    sine.type = "sine";
    sine.frequency.value = frequency * 2;
    overtone.gain.value = 0.25;
    triangle.connect(envelope);
    sine.connect(overtone).connect(envelope);
    envelope.connect(filter);
    envelope.gain.setValueAtTime(0, time);
    envelope.gain.linearRampToValueAtTime(peak, time + 0.008);
    envelope.gain.exponentialRampToValueAtTime(peak * 0.56, time + 0.258);
    triangle.start();
    sine.start();
    voices.set(id, {midi, silent, envelope, triangle, sine});
    if (!silent) report(midi, true);
    triangle.onended = () =>
    {
        triangle.disconnect();
        sine.disconnect();
        overtone.disconnect();
        envelope.disconnect();
    };
    return id;
}
export function noteOff(id)
{
    const voice = voices.get(id);
    if (!voice) return;
    voices.delete(id);
    const time = context.currentTime;
    voice.envelope.gain.cancelScheduledValues(time);
    voice.envelope.gain.setTargetAtTime(0, time, 0.065);
    voice.triangle.stop(time + 0.35);
    voice.sine.stop(time + 0.35);
    if (!voice.silent) report(voice.midi, false);
}
export function schedule(callback, ms)
{
    const id = setTimeout(() =>
    {
        jobs.delete(id);
        callback();
    }, ms);
    jobs.add(id);
    return id;
}
export function stop()
{
    jobs.forEach(clearTimeout);
    jobs.clear();
    [...voices.keys()].forEach(noteOff);
}
export function playNote(midi, ms = 700, silent = false, peak = 0.5)
{
    const id = noteOn(midi, silent, peak);
    schedule(() => noteOff(id), ms);
}
export function playMelodic(midis, silent = false)
{
    midis.forEach((midi, i) => schedule(() => playNote(midi, 400, silent), i * 450));
    schedule(() => midis.forEach((midi) => playNote(midi, 900, silent)), midis.length * 450);
}
export function strum(midis, silent = false)
{
    midis.forEach((midi, i) => schedule(() => playNote(midi, 1200, silent), i * 45));
}
export function playScale(midis, silent = false)
{
    midis.forEach((midi, i) => schedule(() => playNote(midi, 160, silent), i * 170));
}
export function tick(midi)
{
    playNote(midi, 60, false, 0.15);
}
export function audioStatus()
{
    return {created: Boolean(context), state: context?.state ?? "uncreated", muted, voices: voices.size, scheduled: jobs.size, sampleRate: context?.sampleRate ?? null};
}
