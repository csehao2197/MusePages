const BEAT = 0.625;
const BASS = [55, 55, 41.2, 49, 43.65, 43.65, 32.7, 41.2];

export class BeatAudio
{
    constructor(muted)
    {
        this.muted = muted;
        this.context = null;
        this.running = false;
        this.active = new Set();
    }

    async start()
    {
        try
        {
            if (!this.context)
            {
                this.context = new AudioContext();
                this.master = this.context.createGain();
                this.master.connect(this.context.destination);
            }
            await this.context.resume();
            this.stopNotes();
            this.origin = this.context.currentTime;
            this.nextBeat = this.origin;
            this.beat = 0;
            this.running = true;
            this.mute(this.muted);
        }
        catch
        {
            this.running = false;
        }
    }

    tone(type, from, to, gain, duration, time, lowpass = false)
    {
        if (!this.context) return;
        const oscillator = this.context.createOscillator();
        const envelope = this.context.createGain();
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(from, time);
        if (to !== from) oscillator.frequency.exponentialRampToValueAtTime(to, time + duration);
        envelope.gain.setValueAtTime(0.0001, time);
        envelope.gain.exponentialRampToValueAtTime(gain, time + 0.004);
        envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration);
        let filter = null;
        if (lowpass)
        {
            filter = this.context.createBiquadFilter();
            filter.type = "lowpass";
            filter.frequency.value = 220;
            oscillator.connect(filter);
            filter.connect(envelope);
        }
        else oscillator.connect(envelope);
        envelope.connect(this.master);
        oscillator.start(time);
        oscillator.stop(time + duration + 0.01);
        this.active.add(oscillator);
        oscillator.onended = () =>
        {
            oscillator.disconnect();
            envelope.disconnect();
            filter?.disconnect();
            this.active.delete(oscillator);
        };
    }

    schedule()
    {
        if (!this.context || !this.running || this.context.state !== "running") return;
        while (this.nextBeat < this.context.currentTime + 0.15)
        {
            const t = Math.max(this.nextBeat, this.context.currentTime);
            this.tone("triangle", 740, 740, 0.05, 0.05, t);
            this.tone("square", BASS[this.beat % 8], BASS[this.beat % 8], 0.12, 0.2, t, true);
            if (this.beat % 4 === 0) this.tone("sine", 120, 52, 0.2, 0.09, t);
            this.nextBeat += BEAT;
            this.beat++;
        }
    }

    get phase()
    {
        return this.context && this.origin !== undefined ? (this.context.currentTime - this.origin) % BEAT : 0;
    }

    eat()
    {
        this.tone("sine", 520, 880, 0.15, 0.07, this.context?.currentTime ?? 0);
    }

    stopNotes()
    {
        for (const note of this.active)
        {
            try { note.stop(); } catch { /* Already ended. */ }
        }
        this.active.clear();
    }

    end(reason)
    {
        this.running = false;
        this.stopNotes();
        if (!this.context) return;
        const t = this.context.currentTime;
        if (reason === "ended") this.master.gain.setTargetAtTime(0, t, 0.026);
        else if (reason === "clear")
        {
            [523, 659, 784].forEach((frequency, index) => this.tone("sine", frequency, frequency, 0.12, 0.12, t + index * 0.12));
        }
        else this.tone("sine", 200, 45, 0.16, 0.32, t);
    }

    mute(value)
    {
        this.muted = value;
        if (this.master) this.master.gain.setTargetAtTime(value ? 0 : 0.2, this.context.currentTime, 0.01);
    }

    pause()
    {
        this.context?.suspend().catch(() => {});
    }

    resume()
    {
        this.context?.resume().catch(() => {});
    }

    async dispose()
    {
        this.running = false;
        this.stopNotes();
        if (this.context && this.context.state !== "closed") await this.context.close();
    }
}
