export class Audio
{
    constructor(enabled)
    {
        this.enabled = enabled;
        this.context = null;
    }
    play(cue)
    {
        if (!this.enabled) return;
        const Context = window.AudioContext || window.webkitAudioContext;
        if (!Context) return;
        try
        {
            this.context ||= new Context();
            if (this.context.state === "suspended") this.context.resume().catch(() => {});
            const ctx = this.context, now = ctx.currentTime;
            const sequences =
            {
                place: [[740, .05, "sine"]], remove: [[196, .07, "sine"]],
                advance: [[330, .09, "triangle", 440]],
                growth: [[523, .08, "sine"], [659, .08, "sine"]],
                win: [[523, .1, "sine"], [659, .1, "sine"], [784, .1, "sine"], [1046, .1, "sine"]],
                fail: [[220, .14, "sine"], [146, .14, "sine"]]
            };
            if (cue === "storm")
            {
                const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * .28), ctx.sampleRate);
                const data = buffer.getChannelData(0);
                let seed = 0xC1A0E11;
                for (let i = 0; i < data.length; i++)
                {
                    seed = (1664525 * seed + 1013904223) >>> 0;
                    data[i] = seed / 2147483648 - 1;
                }
                const source = ctx.createBufferSource(), filter = ctx.createBiquadFilter(), gain = ctx.createGain();
                source.buffer = buffer;
                filter.type = "bandpass";
                filter.frequency.value = 400;
                source.connect(filter).connect(gain).connect(ctx.destination);
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(.035, now + .02);
                gain.gain.setValueAtTime(.035, now + .26);
                gain.gain.linearRampToValueAtTime(0, now + .28);
                source.start(now);
                source.onended = () => { source.disconnect(); filter.disconnect(); gain.disconnect(); };
                return;
            }
            let delay = 0;
            for (const [frequency, duration, type, target] of sequences[cue] || [])
            {
                const oscillator = ctx.createOscillator(), gain = ctx.createGain(), start = now + delay;
                oscillator.type = type;
                oscillator.frequency.setValueAtTime(frequency, start);
                if (target) oscillator.frequency.linearRampToValueAtTime(target, start + duration);
                gain.gain.setValueAtTime(0, start);
                gain.gain.linearRampToValueAtTime(.035, start + .02);
                gain.gain.setValueAtTime(.035, start + Math.max(.02, duration - .02));
                gain.gain.linearRampToValueAtTime(0, start + duration);
                oscillator.connect(gain).connect(ctx.destination);
                oscillator.start(start);
                oscillator.stop(start + duration);
                oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
                delay += duration + .04;
            }
        }
        catch { /* Audio is optional when browser policy denies a context. */ }
    }
    dispose()
    {
        if (this.context && this.context.state !== "closed") this.context.close().catch(() => {});
    }
}
