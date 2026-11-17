export class SamplePlayer
{
    constructor(url, onChange)
    {
        this.url = url;
        this.onChange = onChange;
        this.offset = 0;
        this.volume = 0.65;
        this.playing = false;
        this.loading = false;
    }

    async prepare()
    {
        if (this.buffer) return;
        this.context ??= new AudioContext();
        this.gain ??= this.context.createGain();
        this.analyser ??= this.context.createAnalyser();
        this.analyser.fftSize = 128;
        this.gain.gain.value = this.volume;
        this.gain.connect(this.analyser);
        this.analyser.connect(this.context.destination);
        const response = await fetch(this.url);
        if (!response.ok) throw new Error("Local audio unavailable");
        this.buffer = await this.context.decodeAudioData(await response.arrayBuffer());
    }

    get duration()
    {
        return this.buffer?.duration ?? 12;
    }

    get time()
    {
        return this.playing ? (this.offset + this.context.currentTime - this.started) % this.duration : this.offset;
    }

    async toggle()
    {
        if (this.loading) return;
        if (this.playing)
        {
            this.pause();
            return;
        }
        this.loading = true;
        this.onChange("loading");
        try
        {
            await this.prepare();
            await this.context.resume();
            this.start();
        }
        catch
        {
            this.onChange("error");
        }
        finally
        {
            this.loading = false;
        }
    }

    start()
    {
        this.source = this.context.createBufferSource();
        this.source.buffer = this.buffer;
        this.source.loop = true;
        this.source.loopStart = 0;
        this.source.loopEnd = this.duration;
        this.source.connect(this.gain);
        this.started = this.context.currentTime;
        this.source.start(0, this.offset);
        this.playing = true;
        this.onChange("playing");
    }

    pause()
    {
        if (!this.playing) return;
        this.offset = this.time;
        this.source.stop();
        this.source.disconnect();
        this.playing = false;
        this.onChange("paused");
    }

    seek(seconds)
    {
        const resume = this.playing;
        if (resume) this.pause();
        this.offset = Math.max(0, Math.min(this.duration - 0.01, seconds));
        if (resume) this.start();
    }

    setVolume(value)
    {
        this.volume = Math.max(0, Math.min(1, value));
        if (this.gain) this.gain.gain.setTargetAtTime(this.volume, this.context.currentTime, 0.03);
    }

    getLevels()
    {
        const bins = new Uint8Array(this.analyser?.frequencyBinCount ?? 64);
        this.analyser?.getByteFrequencyData(bins);
        return Array.from({ length: 24 }, (_, i) => bins[Math.floor(i * bins.length / 24)] / 255);
    }
}
