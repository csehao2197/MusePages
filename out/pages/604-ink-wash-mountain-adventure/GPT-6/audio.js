import { STORAGE_KEY } from "./content.js";

export function createAudio()
{
    let context;
    let master;
    let enabled = false;
    let ambient;
    let filter;
    const voices = new Set();
    try
    {
        enabled = localStorage.getItem(`${STORAGE_KEY}-sound`) === "true";
    }
    catch {}
    function ensure()
    {
        if (context) return;
        context = new AudioContext();
        master = context.createGain();
        master.gain.value = .12;
        master.connect(context.destination);
        const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
        const data = buffer.getChannelData(0);
        let last = 0;
        for (let i = 0; i < data.length; i++)
        {
            last = (last + (Math.random() * 2 - 1) * .03) / 1.02;
            data[i] = last;
        }
        ambient = context.createBufferSource();
        ambient.buffer = buffer;
        ambient.loop = true;
        filter = context.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 650;
        ambient.connect(filter).connect(master);
        ambient.start();
    }
    return {
        get enabled() { return enabled; },
        async activate()
        {
            if (!enabled) return;
            ensure();
            await context.resume();
        },
        async toggle()
        {
            enabled = !enabled;
            try { localStorage.setItem(`${STORAGE_KEY}-sound`, String(enabled)); } catch {}
            if (enabled)
            {
                ensure();
                await context.resume();
            }
            else if (context) await context.suspend();
            return enabled;
        },
        play(type)
        {
            if (!enabled || !context || context.state !== "running") return;
            const oscillator = context.createOscillator();
            const gain = context.createGain();
            const frequencies = { strike: 190, dodge: 370, hurt: 85, resolve: 660, thunder: 42 };
            oscillator.type = type === "thunder" ? "triangle" : "sine";
            oscillator.frequency.setValueAtTime(frequencies[type] || 200, context.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime((frequencies[type] || 200) * .5, context.currentTime + .3);
            gain.gain.setValueAtTime(type === "thunder" ? .4 : .7, context.currentTime);
            gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + .6);
            oscillator.connect(gain).connect(master);
            voices.add(oscillator);
            oscillator.onended = () =>
            {
                oscillator.disconnect();
                gain.disconnect();
                voices.delete(oscillator);
            };
            oscillator.start();
            oscillator.stop(context.currentTime + .65);
        },
        async pause()
        {
            if (context?.state === "running") await context.suspend();
        },
        async dispose()
        {
            for (const voice of voices) voice.stop();
            ambient?.stop();
            ambient?.disconnect();
            filter?.disconnect();
            master?.disconnect();
            if (context) await context.close();
        }
    };
}
