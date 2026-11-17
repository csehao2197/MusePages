export function mulberry32(seed)
{
    return () =>
    {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

export class FestivalAudio
{
    playing = false;
    muted = false;
    failed = false;
    offset = 0;
    voices = [];
    previewSerial = 0;

    async ready()
    {
        if (!this.context)
        {
            this.context = new AudioContext();
            this.master = this.context.createGain();
            this.master.gain.value = this.muted ? 0 : .65;
            this.master.connect(this.context.destination);
            this.loopGain = this.context.createGain();
            this.analyser = this.context.createAnalyser();
            this.analyser.fftSize = 2048;
            this.analyser.smoothingTimeConstant = .78;
            this.loopGain.connect(this.analyser).connect(this.master);
            this.previewAnalyser = this.context.createAnalyser();
            this.previewAnalyser.fftSize = 512;
            this.previewAnalyser.connect(this.master);
        }
        if (this.context.state === "suspended") await this.context.resume();
    }

    async toggle()
    {
        if (this.busy) return this.playing;
        this.busy = true;
        try
        {
            await this.ready();
            if (this.playing)
            {
                this.offset = (this.offset + this.context.currentTime - this.started) % this.buffer.duration;
                this.source.stop();
                this.source.disconnect();
                this.playing = false;
            }
            else
            {
                if (!this.buffer)
                {
                    const response = await fetch(new URL("./audio/loop.wav", import.meta.url));
                    if (!response.ok) throw new Error("Audio unavailable");
                    this.buffer = await this.context.decodeAudioData(await response.arrayBuffer());
                }
                this.source = this.context.createBufferSource();
                this.source.buffer = this.buffer;
                this.source.loop = true;
                this.source.connect(this.loopGain);
                this.source.start(0, this.offset);
                this.started = this.context.currentTime;
                this.playing = true;
                this.failed = false;
            }
        }
        catch
        {
            this.failed = true;
            this.playing = false;
        }
        finally
        {
            this.busy = false;
        }
        return this.playing;
    }

    mute()
    {
        this.muted = !this.muted;
        if (this.master) this.master.gain.setTargetAtTime(this.muted ? 0 : .65, this.context.currentTime, .02);
        return this.muted;
    }

    preview(index, root)
    {
        if (!this.context) return;
        this.stopPreview();
        const serial = ++this.previewSerial;
        const ctx = this.context;
        const random = mulberry32(index + 1);
        const step = .125 + random() * .065;
        const offsets = [0, 3, 5, 7, 10, 12];
        const group = ctx.createGain();
        group.connect(this.previewAnalyser);
        this.previewGroup = group;
        this.loopGain.gain.cancelScheduledValues(ctx.currentTime);
        this.loopGain.gain.setTargetAtTime(.18, ctx.currentTime, .05);
        for (let i = 0; i < 16; i++)
        {
            const oscillator = ctx.createOscillator();
            const filter = ctx.createBiquadFilter();
            const gain = ctx.createGain();
            const time = ctx.currentTime + i * step;
            oscillator.type = ["sawtooth", "square", "triangle"][index % 3];
            oscillator.frequency.value = root * 2 ** (offsets[Math.floor(random() * offsets.length)] / 12);
            filter.type = "lowpass";
            filter.frequency.value = 1800;
            filter.Q.value = 6;
            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(.085, time + .012);
            gain.gain.exponentialRampToValueAtTime(.001, time + step * .92);
            oscillator.connect(filter).connect(gain).connect(group);
            oscillator.start(time);
            oscillator.stop(time + step);
            oscillator.onended = () => { oscillator.disconnect(); filter.disconnect(); gain.disconnect(); };
            this.voices.push(oscillator);
        }
        this.previewTimer = setTimeout(() => { if (serial === this.previewSerial) this.stopPreview(); }, step * 16000 + 100);
    }

    stopPreview()
    {
        clearTimeout(this.previewTimer);
        this.previewSerial++;
        if (!this.context) return;
        const group = this.previewGroup;
        const voices = this.voices;
        this.voices = [];
        this.previewGroup = null;
        if (group)
        {
            const now = this.context.currentTime;
            group.gain.cancelScheduledValues(now);
            group.gain.setTargetAtTime(0, now, .025);
            for (const voice of voices) { try { voice.stop(now + .12); } catch { /* Already-ended notes need no further stop. */ } }
            setTimeout(() => group.disconnect(), 150);
        }
        this.loopGain.gain.cancelScheduledValues(this.context.currentTime);
        this.loopGain.gain.setTargetAtTime(1, this.context.currentTime, .05);
    }

    frequency()
    {
        if (!this.playing && !this.previewGroup) return null;
        const analyser = this.previewGroup ? this.previewAnalyser : this.analyser;
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
        return data;
    }

    close()
    {
        this.stopPreview();
        if (this.context && this.context.state !== "closed") this.context.close();
    }
}
