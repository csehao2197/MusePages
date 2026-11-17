export class CaveAudio
{
    constructor()
    {
        this.context = null;
        this.nodes = [];
        this.chimes = new Set();
    }

    async enable()
    {
        const Context = window.AudioContext || window.webkitAudioContext;
        if (!Context) return false;
        this.context ??= new Context();
        await this.context.resume();
        if (this.nodes.length) return true;
        const oscillator = this.context.createOscillator();
        const gain = this.context.createGain();
        oscillator.type = "sine";
        oscillator.frequency.value = 83;
        gain.gain.value = 0.018;
        oscillator.connect(gain).connect(this.context.destination);
        oscillator.start();
        this.nodes.push(oscillator, gain);
        const noise = this.context.createBufferSource();
        const buffer = this.context.createBuffer(1, this.context.sampleRate * 2, this.context.sampleRate);
        const samples = buffer.getChannelData(0);
        for (let index = 0; index < samples.length; index++) samples[index] = Math.random() * 2 - 1;
        noise.buffer = buffer;
        noise.loop = true;
        const filter = this.context.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 180;
        const noiseGain = this.context.createGain();
        noiseGain.gain.value = 0.008;
        noise.connect(filter).connect(noiseGain).connect(this.context.destination);
        noise.start();
        this.nodes.push(noise, filter, noiseGain);
        return true;
    }

    disable()
    {
        for (const node of this.nodes)
        {
            if (node instanceof OscillatorNode || node instanceof AudioBufferSourceNode) node.stop();
            node.disconnect();
        }
        for (const { oscillator, gain } of this.chimes)
        {
            oscillator.onended = null;
            oscillator.stop();
            oscillator.disconnect();
            gain.disconnect();
        }
        this.chimes.clear();
        this.nodes = [];
    }

    chime()
    {
        if (!this.nodes.length || !this.context) return;
        [330, 440, 660].forEach((frequency, index) =>
        {
            const oscillator = this.context.createOscillator();
            const gain = this.context.createGain();
            const at = this.context.currentTime + index * 0.12;
            const entry = { oscillator, gain };
            this.chimes.add(entry);
            oscillator.frequency.value = frequency;
            gain.gain.setValueAtTime(0, at);
            gain.gain.linearRampToValueAtTime(0.035, at + 0.025);
            gain.gain.exponentialRampToValueAtTime(0.0001, at + 1);
            oscillator.connect(gain).connect(this.context.destination);
            oscillator.onended = () =>
            {
                oscillator.disconnect();
                gain.disconnect();
                this.chimes.delete(entry);
            };
            oscillator.start(at);
            oscillator.stop(at + 1.1);
        });
    }

    async close()
    {
        this.disable();
        if (this.context) await this.context.close();
    }
}
