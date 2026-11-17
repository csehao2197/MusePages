export class Sound
{
    constructor()
    {
        this.enabled = false;
    }
    async toggle()
    {
        try
        {
            if (!this.context)
            {
                this.context = new AudioContext();
                this.engine = this.context.createOscillator();
                this.engine.type = "sawtooth";
                this.gain = this.context.createGain();
                this.gain.gain.value = 0;
                this.engine.connect(this.gain).connect(this.context.destination);
                this.engine.start();
            }
            await this.context.resume();
            this.enabled = !this.enabled;
            this.update(0, false);
        }
        catch { this.enabled = false; }
    }
    tone(frequency, duration = .08, delay = 0)
    {
        if (!this.enabled) return;
        const now = this.context.currentTime + delay;
        const oscillator = this.context.createOscillator();
        const gain = this.context.createGain();
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(.035, now + .02);
        gain.gain.linearRampToValueAtTime(0, now + duration);
        oscillator.connect(gain).connect(this.context.destination);
        oscillator.start(now);
        oscillator.stop(now + duration);
    }
    boost()
    {
        if (!this.enabled) return;
        const buffer = this.context.createBuffer(1, Math.ceil(this.context.sampleRate * .12), this.context.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = (Math.sin(i * 217.1) * Math.sin(i * 19.7)) * .04 * (1 - i / data.length);
        const source = this.context.createBufferSource();
        source.buffer = buffer;
        source.connect(this.context.destination);
        source.start();
    }
    update(speed, live)
    {
        if (!this.context) return;
        this.gain.gain.setTargetAtTime(this.enabled && live ? .02 : 0, this.context.currentTime, .04);
        this.engine.frequency.setTargetAtTime(45 + Math.abs(speed) * 5, this.context.currentTime, .04);
    }
}
