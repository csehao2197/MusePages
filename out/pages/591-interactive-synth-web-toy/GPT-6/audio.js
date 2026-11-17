import { voices } from "./presets.js";

export const frequency = (midi) => 440 * 2 ** ((midi - 69) / 12);

export class Synth
{
    constructor()
    {
        this.context = null;
        this.live = [];
        this.volume = 70;
        this.bpm = 112;
    }

    async unlock()
    {
        const Audio = window.AudioContext || window.webkitAudioContext;
        if (!Audio) return false;
        if (!this.context)
        {
            this.context = new Audio();
            this.bus = this.context.createGain();
            this.compressor = this.context.createDynamicsCompressor();
            this.compressor.threshold.value = -14;
            this.compressor.ratio.value = 6;
            this.delay = this.context.createDelay(2);
            this.feedback = this.context.createGain();
            this.wet = this.context.createGain();
            this.master = this.context.createGain();
            this.analyser = this.context.createAnalyser();
            this.analyser.fftSize = 2048;
            this.feedback.gain.value = 0.28;
            this.wet.gain.value = 0.16;
            this.bus.connect(this.compressor);
            this.bus.connect(this.delay);
            this.delay.connect(this.feedback).connect(this.delay);
            this.delay.connect(this.wet).connect(this.compressor);
            this.compressor.connect(this.master).connect(this.analyser).connect(this.context.destination);
            this.setVolume(this.volume);
            this.setTempo(this.bpm);
        }
        if (this.context.state === "suspended") await this.context.resume();
        return this.context.state === "running";
    }

    setVolume(value)
    {
        this.volume = value;
        if (this.master) this.master.gain.setValueAtTime((value / 100) ** 2 * 0.9, this.context.currentTime);
    }

    setTempo(value)
    {
        this.bpm = value;
        if (this.delay) this.delay.delayTime.setValueAtTime(3 * 60 / value / 4, this.context.currentTime);
    }

    note(midi, voiceIndex, tone, when = this.context.currentTime)
    {
        if (this.live.length >= 12) this.live[0].kill();
        const preset = voices[voiceIndex];
        const t = Math.max(when, this.context.currentTime);
        const envelope = this.context.createGain();
        const filter = this.context.createBiquadFilter();
        const cutoff = Math.min(20000, preset.cutoff * 2 ** ((tone - 60) / 30));
        filter.type = "lowpass";
        filter.Q.value = preset.q;
        filter.frequency.setValueAtTime(voiceIndex === 2 ? Math.min(20000, cutoff * 3) : cutoff, t);
        if (voiceIndex === 2) filter.frequency.exponentialRampToValueAtTime(cutoff, t + 0.18);
        envelope.gain.setValueAtTime(0, t);
        envelope.gain.linearRampToValueAtTime(preset.peak, t + preset.attack);
        envelope.gain.linearRampToValueAtTime(preset.peak * preset.sustain, t + preset.attack + preset.decay);
        envelope.connect(filter).connect(this.bus);
        const oscillators = preset.waves.map(([type, detune, gain]) =>
        {
            const oscillator = this.context.createOscillator();
            const level = this.context.createGain();
            oscillator.type = type;
            oscillator.frequency.value = frequency(midi + preset.transpose);
            oscillator.detune.value = detune;
            level.gain.value = gain;
            oscillator.connect(level).connect(envelope);
            oscillator.start(t);
            return { oscillator, level };
        });
        const voice = { midi, t, preset, envelope, filter, oscillators, released: false, releaseAt: Infinity };
        const remove = () =>
        {
            const index = this.live.indexOf(voice);
            if (index >= 0) this.live.splice(index, 1);
        };
        let ended = 0;
        for (const { oscillator, level } of oscillators)
        {
            oscillator.onended = () =>
            {
                oscillator.disconnect();
                level.disconnect();
                if (++ended === oscillators.length)
                {
                    envelope.disconnect();
                    filter.disconnect();
                    remove();
                }
            };
        }
        voice.release = (time = this.context.currentTime) =>
        {
            if (voice.released && voice.releaseAt <= time) return;
            const elapsed = Math.max(0, time - t);
            let value;
            if (voice.released && time >= voice.releaseAt)
            {
                value = voice.releaseValue * Math.exp(-Math.max(0, time - voice.releaseAt) / (preset.release / 3));
            }
            else if (elapsed < preset.attack) value = preset.peak * elapsed / preset.attack;
            else if (elapsed < preset.attack + preset.decay) value = preset.peak * (1 - (1 - preset.sustain) * (elapsed - preset.attack) / preset.decay);
            else value = preset.peak * preset.sustain;
            envelope.gain.cancelScheduledValues(time);
            if (time > t && elapsed < preset.attack + preset.decay && !(voice.released && time >= voice.releaseAt))
            {
                envelope.gain.linearRampToValueAtTime(value, time);
            }
            envelope.gain.setValueAtTime(time < t ? 0 : value, time);
            envelope.gain.setTargetAtTime(0, time, preset.release / 3);
            voice.released = true;
            voice.releaseAt = time;
            voice.releaseValue = value;
            for (const { oscillator } of oscillators) oscillator.stop(time + preset.release + 0.1);
        };
        voice.kill = () =>
        {
            envelope.gain.cancelScheduledValues(this.context.currentTime);
            envelope.gain.setValueAtTime(0, this.context.currentTime);
            for (const { oscillator } of oscillators) oscillator.stop(this.context.currentTime);
            remove();
        };
        this.live.push(voice);
        return voice;
    }

    releaseAll()
    {
        for (const voice of [...this.live]) voice.release();
    }
}
