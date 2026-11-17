import { BRAND } from "./content.js";
import { mulberry32 } from "./tuning.js";

export class Tones
{
    constructor()
    {
        this.muted = false;
        this.key = `tones-${BRAND.toLowerCase().replaceAll(" ", "-")}`;
        try
        {
            this.muted = localStorage.getItem(this.key) === "muted";
        }
        catch {}
    }

    start()
    {
        try
        {
            if (!this.context)
            {
                this.context = new AudioContext();
                this.master = this.context.createGain();
                this.master.gain.value = .16;
                this.master.connect(this.context.destination);
                this.noise = this.context.createBuffer(1, this.context.sampleRate, this.context.sampleRate);
                const random = mulberry32(0xA0D10);
                const data = this.noise.getChannelData(0);
                for (let i = 0; i < data.length; i++) data[i] = random() * 2 - 1;
            }
            this.context.resume().catch(() => {});
        }
        catch
        {
            this.muted = true;
        }
    }

    toggle()
    {
        this.muted = !this.muted;
        try
        {
            localStorage.setItem(this.key, this.muted ? "muted" : "on");
        }
        catch {}
        if (this.context) this.master.gain.value = this.muted ? 0 : .16;
    }

    play(kind)
    {
        if (!this.context || this.muted || document.hidden) return;
        const cues =
        {
            bolt: [940, .03, .04], tick: [520, .02, .035], missile: [160, .08, .08],
            boost: [98, .08, .1], roll: [320, .04, .08], clear: [659, .21, .08],
            hit: [400, .12, .06], destroy: [900, .08, .06], end: [200, .22, .1]
        };
        const [frequency, duration, volume] = cues[kind];
        const time = this.context.currentTime;
        const gain = this.context.createGain();
        gain.gain.setValueAtTime(volume, time);
        gain.gain.exponentialRampToValueAtTime(.0001, time + duration);
        gain.connect(this.master);
        if (["hit", "destroy", "end"].includes(kind))
        {
            const source = this.context.createBufferSource();
            source.buffer = this.noise;
            const filter = this.context.createBiquadFilter();
            filter.type = kind === "hit" ? "bandpass" : "lowpass";
            filter.frequency.setValueAtTime(kind === "end" ? 1200 : frequency, time);
            filter.frequency.exponentialRampToValueAtTime(frequency, time + duration);
            source.connect(filter).connect(gain);
            source.start(time);
            source.stop(time + duration);
        }
        else
        {
            const oscillator = this.context.createOscillator();
            oscillator.type = kind === "missile" ? "square" : "sine";
            oscillator.frequency.setValueAtTime(frequency, time);
            if (kind === "roll") oscillator.frequency.setValueAtTime(640, time + .025);
            oscillator.connect(gain);
            oscillator.start(time);
            oscillator.stop(time + duration);
        }
    }
}
