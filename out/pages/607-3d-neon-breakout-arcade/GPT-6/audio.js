export class CabinetAudio
{
    constructor(muted)
    {
        this.muted = muted;
        this.context = null;
        this.failed = false;
    }

    async unlock()
    {
        if (this.failed) return;
        try
        {
            this.context ||= new AudioContext();
            await this.context.resume();
        }
        catch
        {
            this.failed = true;
            this.muted = true;
        }
    }

    silence()
    {
        if (this.context?.state === "running") this.context.suspend().catch(() => {});
    }

    tone(frequency, duration, type = "sine", delay = 0, gain = .04, end)
    {
        if (this.muted || !this.context || this.context.state !== "running") return;
        const t = this.context.currentTime + delay;
        const oscillator = this.context.createOscillator();
        const volume = this.context.createGain();
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, t);
        if (end) oscillator.frequency.exponentialRampToValueAtTime(end, t + duration);
        volume.gain.setValueAtTime(0, t);
        volume.gain.linearRampToValueAtTime(gain, t + Math.min(.02, duration / 2));
        volume.gain.linearRampToValueAtTime(0, t + duration);
        oscillator.connect(volume);
        volume.connect(this.context.destination);
        oscillator.start(t);
        oscillator.stop(t + duration);
        oscillator.onended = () =>
        {
            oscillator.disconnect();
            volume.disconnect();
        };
    }

    play(name)
    {
        if (name === "bar") this.tone(392, .045, "sine", 0, .06);
        if (name === "break") this.tone(620, .04, "square");
        if (name === "chip") this.tone(480, .035, "triangle");
        if (name === "wall") this.tone(196, .03);
        if (name === "pickup") [523, 784].forEach((f, i) => this.tone(f, .06, "sine", i * .06));
        if (name === "lost" || name === "fail") this.tone(360, .16, "sine", 0, .04, 140);
        if (name === "clear" || name === "win") (name === "win" ? [523, 659, 784, 1046] : [523, 659, 784]).forEach((f, i) => this.tone(f, .09, "sine", i * .09));
    }
}
