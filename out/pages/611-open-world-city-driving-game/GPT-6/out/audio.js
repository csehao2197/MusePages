export function makeAudio(bests, save)
{
    let context = null;
    let oscillator = null;
    let gain = null;
    function activate()
    {
        if (bests.mute) return;
        if (!context)
        {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            context = new AudioContext();
            oscillator = context.createOscillator();
            gain = context.createGain();
            oscillator.type = "triangle";
            gain.gain.value = 0;
            oscillator.connect(gain).connect(context.destination);
            oscillator.start();
        }
        if (context.state === "suspended") context.resume().catch(() => {});
    }
    function toggle()
    {
        bests.mute = !bests.mute;
        save();
        activate();
        if (gain && bests.mute) gain.gain.value = 0;
    }
    function update(speed, driving, paused)
    {
        if (!gain) return;
        gain.gain.setTargetAtTime(!bests.mute && driving && !paused ? .018 : 0, context.currentTime, .1);
        oscillator.frequency.setTargetAtTime(45 + Math.abs(speed) * 4, context.currentTime, .08);
    }
    function chime()
    {
        activate();
        if (!context || bests.mute) return;
        const note = context.createOscillator();
        const volume = context.createGain();
        note.type = "sine";
        note.frequency.setValueAtTime(520, context.currentTime);
        note.frequency.exponentialRampToValueAtTime(780, context.currentTime + .12);
        volume.gain.setValueAtTime(.05, context.currentTime);
        volume.gain.exponentialRampToValueAtTime(.001, context.currentTime + .35);
        note.connect(volume).connect(context.destination);
        note.start();
        note.stop(context.currentTime + .36);
        note.onended = () => { note.disconnect(); volume.disconnect(); };
    }
    function close()
    {
        if (context) context.close().catch(() => {});
    }
    return { activate, toggle, update, chime, close };
}
