export function createAudio()
{
    let context;
    let oscillator;
    let gain;
    let enabled = false;
    return {
        toggle()
        {
            enabled = !enabled;
            if (enabled && !context)
            {
                context = new AudioContext();
                oscillator = context.createOscillator();
                gain = context.createGain();
                oscillator.type = "sawtooth";
                gain.gain.value = 0;
                oscillator.connect(gain).connect(context.destination);
                oscillator.start();
            }
            if (enabled) context.resume();
            return enabled;
        },
        update(run)
        {
            if (!context) return;
            gain.gain.setTargetAtTime(enabled && run.phase === "running" ? 0.018 : 0, context.currentTime, 0.1);
            oscillator.frequency.setTargetAtTime(35 + run.speed * 0.4, context.currentTime, 0.1);
        },
        close()
        {
            context?.close();
        }
    };
}
