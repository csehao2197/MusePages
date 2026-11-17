export function createAudio()
{
    let context;
    let enabled = false;
    function toggle()
    {
        try
        {
            context ??= new (window.AudioContext || window.webkitAudioContext)();
            if (context.state === "suspended") context.resume();
            enabled = !enabled;
        }
        catch
        {
            return null;
        }
        return enabled;
    }
    function chime(success = false)
    {
        if (!enabled || !context) return;
        [523.25, 659.25, success ? 1046.5 : 783.99].forEach((frequency, index) =>
        {
            const oscillator = context.createOscillator();
            const gain = context.createGain();
            oscillator.type = "sine";
            oscillator.frequency.value = frequency;
            const start = context.currentTime + index * 0.1;
            gain.gain.setValueAtTime(0, start);
            gain.gain.linearRampToValueAtTime(0.06, start + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);
            oscillator.connect(gain).connect(context.destination);
            oscillator.start(start);
            oscillator.stop(start + 0.32);
        });
    }
    return { toggle, chime };
}
