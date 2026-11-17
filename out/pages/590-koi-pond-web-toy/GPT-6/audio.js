export function createAudio(state, random)
{
    let context = null;
    let output;
    let ambient;
    let delay;
    let rainGain;
    let waterFilter;
    let nextNote = 0;
    let nextCricket = 0;
    let nextDrip = 0;
    let walk = 2;
    let enabled = false;
    let interval;
    const major = [146.832, 164.814, 184.997, 220, 246.942];
    const minor = [146.832, 174.614, 195.998, 220, 261.626];
    function scale()
    {
        return state.season < 2 ? major : minor;
    }
    function note(frequency, at, duration = 3.2, gain = 0.1, bus = ambient, pan = 0)
    {
        if (!context) return;
        const envelope = context.createGain();
        const stereo = context.createStereoPanner();
        stereo.pan.value = pan;
        envelope.gain.setValueAtTime(0.0001, at);
        envelope.gain.exponentialRampToValueAtTime(gain, at + 0.02);
        envelope.gain.exponentialRampToValueAtTime(0.0001, at + duration);
        envelope.connect(stereo).connect(bus);
        if (bus === ambient) envelope.connect(delay);
        for (let i = 0; i < 2; i++)
        {
            const osc = context.createOscillator();
            const volume = context.createGain();
            osc.type = i ? "triangle" : "sine";
            osc.frequency.value = frequency * (i ? 2 : 1);
            volume.gain.value = i ? 0.13 : 1;
            osc.connect(volume).connect(envelope);
            osc.start(at);
            osc.stop(at + duration + 0.1);
            osc.onended = () =>
            {
                osc.disconnect();
                volume.disconnect();
                if (i) { envelope.disconnect(); stereo.disconnect(); }
            };
        }
    }
    function schedule()
    {
        if (!context || !enabled) return;
        const now = context.currentTime;
        if (nextNote < now + 0.25)
        {
            walk = Math.max(0, Math.min(9, walk + Math.floor(random() * 5) - 2));
            const s = scale();
            const octave = state.season === 3 ? 2 : 1;
            const pitch = s[walk % 5] * (walk > 4 ? 2 : 1) * octave * (state.night > 0.5 ? 0.5 : 1);
            const at = Math.max(now + 0.02, nextNote);
            note(pitch, at, 3.2, 0.065);
            if (random() < 0.25) note(pitch * 1.5, at + 0.38, 3.2, 0.035);
            nextNote = at + (state.season === 3 ? 3 + random() * 4 : 1.4 + random() * 2.8);
        }
        if (state.night > 0.2 && state.season !== 3 && nextCricket < now + 0.2)
        {
            for (let i = 0; i < 3; i++) note(4200, now + 0.03 + i * 0.08, 0.05, 0.004 * state.night);
            nextCricket = now + 1.5 + random() * 1.5;
        }
        if (state.rain > 0.1 && nextDrip < now + 0.1)
        {
            note(700 + random() * 600, now + 0.03, 0.2, state.rain * 0.008);
            nextDrip = now + 0.25 + random() * 0.2;
        }
        rainGain.gain.setTargetAtTime(state.rain * 0.028, now, 0.8);
        waterFilter.frequency.setTargetAtTime(650 + Math.sin(now * 0.11 * Math.PI * 2) * 250, now, 0.2);
    }
    async function unlock()
    {
        try
        {
            if (!context)
            {
                context = new AudioContext();
                const compressor = context.createDynamicsCompressor();
                output = context.createGain();
                output.gain.value = 0.5;
                output.connect(compressor).connect(context.destination);
                ambient = context.createGain();
                ambient.gain.value = 0;
                ambient.connect(output);
                delay = context.createDelay(1);
                delay.delayTime.value = 0.42;
                const feedback = context.createGain();
                feedback.gain.value = 0.35;
                const wet = context.createGain();
                wet.gain.value = 0.3;
                delay.connect(feedback).connect(delay);
                delay.connect(wet).connect(ambient);
                const lowpass = context.createBiquadFilter();
                lowpass.frequency.value = 900;
                lowpass.connect(ambient);
                const droneGain = context.createGain();
                droneGain.gain.value = 0.035;
                droneGain.connect(lowpass);
                for (const frequency of [146.832, 220])
                {
                    const osc = context.createOscillator();
                    osc.frequency.value = frequency;
                    osc.connect(droneGain);
                    osc.start();
                }
                const tremolo = context.createOscillator();
                const depth = context.createGain();
                tremolo.frequency.value = 0.07;
                depth.gain.value = 0.012;
                tremolo.connect(depth).connect(droneGain.gain);
                tremolo.start();
                const noise = context.createBuffer(1, context.sampleRate * 3, context.sampleRate);
                const samples = noise.getChannelData(0);
                for (let i = 0; i < samples.length; i++) samples[i] = random() * 2 - 1;
                const noiseSource = context.createBufferSource();
                noiseSource.buffer = noise;
                noiseSource.loop = true;
                waterFilter = context.createBiquadFilter();
                waterFilter.type = "bandpass";
                waterFilter.frequency.value = 650;
                const waterGain = context.createGain();
                waterGain.gain.value = 0.025;
                noiseSource.connect(waterFilter).connect(waterGain).connect(ambient);
                const rainFilter = context.createBiquadFilter();
                rainFilter.type = "highpass";
                rainFilter.frequency.value = 1700;
                rainGain = context.createGain();
                rainGain.gain.value = 0;
                noiseSource.connect(rainFilter).connect(rainGain).connect(ambient);
                noiseSource.start();
                interval = setInterval(schedule, 120);
            }
            if (context.state === "suspended") await context.resume();
            return context.state === "running";
        }
        catch
        {
            return false;
        }
    }
    return {
        unlock,
        get enabled() { return enabled; },
        get running() { return context?.state === "running"; },
        async toggle(value)
        {
            if (value && !await unlock()) return false;
            enabled = value;
            if (context)
            {
                ambient.gain.cancelScheduledValues(context.currentTime);
                ambient.gain.setTargetAtTime(value ? 1 : 0, context.currentTime, value ? 0.5 : 0.267);
                if (value) nextNote = context.currentTime + 0.1;
            }
            return enabled;
        },
        tap(x, crack = false)
        {
            if (!context || !enabled) return;
            const at = context.currentTime + 0.01;
            const osc = context.createOscillator();
            const gain = context.createGain();
            const pan = context.createStereoPanner();
            pan.pan.value = x / state.w * 2 - 1;
            osc.frequency.setValueAtTime(crack ? 1900 : 520, at);
            osc.frequency.exponentialRampToValueAtTime(crack ? 700 : 260, at + 0.16);
            gain.gain.setValueAtTime(0.06, at);
            gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.18);
            osc.connect(gain).connect(pan).connect(ambient);
            osc.start(at);
            osc.stop(at + 0.2);
            osc.onended = () => { osc.disconnect(); gain.disconnect(); pan.disconnect(); };
        },
        pellet()
        {
            if (enabled && context) note(980, context.currentTime + 0.01, 0.08, 0.012);
        },
        season()
        {
            if (!enabled || !context) return;
            note(scale()[0], context.currentTime + 0.02, 2, 0.04);
            note(scale()[2], context.currentTime + 0.28, 2, 0.04);
        },
        chime()
        {
            if (!context) return;
            const now = context.currentTime + 0.02;
            for (let i = 0; i < 3; i++)
            {
                for (const frequency of [440, 880, 1318.51]) note(frequency, now + i * 1.6, 6, 0.065, output);
            }
        },
        async close()
        {
            clearInterval(interval);
            if (context && context.state !== "closed") await context.close();
        }
    };
}
