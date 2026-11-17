export class Audio
{
    constructor()
    {
        this.enabled = true;
        this.voices = new Set();
    }

    start()
    {
        try
        {
            if (!this.context)
            {
                const Constructor = window.AudioContext || window.webkitAudioContext;
                if (!Constructor) return;
                this.context = new Constructor();
                this.master = this.context.createGain();
                this.master.gain.value = this.enabled ? 0.16 : 0;
                this.master.connect(this.context.destination);
            }
            this.context.resume().catch(() => {});
        }
        catch
        {
            this.context = null;
        }
    }

    toggle()
    {
        this.enabled = !this.enabled;
        if (this.master) this.master.gain.value = this.enabled ? 0.16 : 0;
    }

    silence()
    {
        for (const voice of this.voices)
        {
            try { voice.stop(); } catch {}
        }
        this.voices.clear();
    }

    tone(type, from, to, length, volume, delay = 0)
    {
        if (!this.context || this.context.state !== "running" || !this.enabled) return;
        const time = this.context.currentTime + delay;
        const voice = this.context.createOscillator();
        const gain = this.context.createGain();
        voice.type = type;
        voice.frequency.setValueAtTime(from, time);
        voice.frequency.exponentialRampToValueAtTime(to, time + length);
        gain.gain.setValueAtTime(volume, time);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + length);
        voice.connect(gain);
        gain.connect(this.master);
        this.voices.add(voice);
        voice.onended = () =>
        {
            voice.disconnect();
            gain.disconnect();
            this.voices.delete(voice);
        };
        voice.start(time);
        voice.stop(time + length + 0.005);
    }

    cue(name)
    {
        const tones =
        {
            shot: ["square", 170, 75, 0.05, 0.06],
            dry: ["square", 900, 900, 0.02, 0.035],
            reload: ["sine", 300, 300, 0.03, 0.05],
            loaded: ["sine", 460, 460, 0.04, 0.05],
            bolt: ["sine", 120, 120, 0.1, 0.045],
            hurt: ["sawtooth", 80, 80, 0.08, 0.05],
            pickup: ["sine", 400, 660, 0.13, 0.05],
            wave: ["sine", 196, 196, 0.18, 0.04]
        };
        if (name === "break")
        {
            [1500, 1900, 2300].forEach((frequency, index) => this.tone("square", frequency, frequency, 0.035, 0.045, index * 0.028));
        }
        else if (tones[name]) this.tone(...tones[name]);
    }
}
