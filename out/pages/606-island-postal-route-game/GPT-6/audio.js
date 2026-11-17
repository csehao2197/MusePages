export function createAudio()
{
    let context;
    const nodes = new Set();
    function chime(enabled)
    {
        if (!enabled) return;
        try
        {
            context ||= new AudioContext();
            context.resume().catch(() => {});
            [523.25, 659.25, 783.99].forEach((frequency, index) =>
            {
                const tone = context.createOscillator();
                const gain = context.createGain();
                nodes.add(tone);
                nodes.add(gain);
                tone.type = "sine";
                tone.frequency.value = frequency;
                const t = context.currentTime + index * .12;
                gain.gain.setValueAtTime(0, t);
                gain.gain.linearRampToValueAtTime(.035, t + .025);
                gain.gain.exponentialRampToValueAtTime(.001, t + .7);
                tone.connect(gain).connect(context.destination);
                tone.start(t);
                tone.stop(t + .75);
                tone.onended = () =>
                {
                    tone.disconnect();
                    gain.disconnect();
                    nodes.delete(tone);
                    nodes.delete(gain);
                };
            });
        }
        catch
        {
            // Sound is optional when browser audio is unavailable.
        }
    }
    return {
        chime,
        dispose()
        {
            nodes.forEach(node => node.disconnect());
            nodes.clear();
            context?.close().catch(() => {});
        }
    };
}
