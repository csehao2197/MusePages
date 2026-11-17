import { gridNotes } from "./presets.js";

export class Sequencer
{
    constructor(synth, state, onStep)
    {
        this.synth = synth;
        this.state = state;
        this.onStep = onStep;
        this.playing = false;
        this.queue = [];
        this.scheduled = 0;
        this.frame = 0;
    }

    start()
    {
        if (this.playing || !this.synth.context) return;
        this.playing = true;
        this.nextStep = 0;
        this.nextTime = this.synth.context.currentTime + 0.05;
        this.timer = setInterval(() => this.schedule(), 25);
        this.schedule();
        const draw = () =>
        {
            if (!this.playing) return;
            while (this.queue.length && this.queue[0].time <= this.synth.context.currentTime)
            {
                const event = this.queue.shift();
                this.onStep(event.step, event.notes);
            }
            this.frame = requestAnimationFrame(draw);
        };
        this.frame = requestAnimationFrame(draw);
    }

    schedule()
    {
        const now = this.synth.context.currentTime;
        if (this.nextTime < now - 0.12)
        {
            this.nextTime = now + 0.05;
            this.queue = [];
        }
        while (this.nextTime < now + 0.12)
        {
            const length = 60 / this.state.bpm / 4;
            const notes = gridNotes.filter((_, row) => (this.state.grid[this.nextStep] & (1 << row)) !== 0);
            for (const midi of notes)
            {
                const voice = this.synth.note(midi, this.state.voice, this.state.tone, this.nextTime);
                voice.release(this.nextTime + voicesGate(this.state.voice) * length);
            }
            this.queue.push({ step: this.nextStep, time: this.nextTime, notes });
            this.scheduled++;
            this.nextStep = (this.nextStep + 1) % 16;
            this.nextTime += length;
        }
    }

    stop()
    {
        this.playing = false;
        clearInterval(this.timer);
        cancelAnimationFrame(this.frame);
        this.queue = [];
        this.synth.releaseAll();
        this.onStep(-1, []);
    }
}

function voicesGate(index)
{
    return index === 0 ? 1.5 : 0.9;
}
