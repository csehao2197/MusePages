// Tiny Web Audio beat engine: synthesizes each preview live (808, drums, chords, lead) at the beat's BPM and key.
// No audio files are bundled. Exposes window.Synth.create().
(function () {
  "use strict";
  const MIN = [[0, 3, 7, 10], [8, 12, 15, 19], [3, 7, 10, 14], [10, 14, 17, 21]]; // i7 – VI – III – VII
  const MAJ = [[0, 4, 7, 11], [7, 11, 14, 17], [9, 12, 16, 19], [5, 9, 12, 16]]; // I – V – vi – IV
  const STYLES = {
    trap: { kick: [0, 7, 10], snare: [8], hat: (s) => s % 2 === 0 || s === 13 || s === 15, roll: [14, 15], half: true },
    rnb: { kick: [0, 6, 9], snare: [4, 12], hat: (s) => s % 2 === 0, roll: [], half: false },
    drill: { kick: [0, 11], snare: [8, 14], hat: (s) => [0, 3, 6, 8, 11, 14].includes(s), roll: [15], half: true },
    boom: { kick: [0, 7, 10], snare: [4, 12], hat: (s) => s % 2 === 0, roll: [], half: false, swing: 0.12 },
  };
  const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

  function create() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    const ctx = new AC();
    const master = ctx.createGain(); master.gain.value = 0.8;
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4;
    const analyser = ctx.createAnalyser(); analyser.fftSize = 1024;
    master.connect(comp).connect(analyser).connect(ctx.destination);
    const noise = (() => { const b = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; return b; })();
    const shaper = (amt) => { const s = ctx.createWaveShaper(), c = new Float32Array(1024); for (let i = 0; i < 1024; i++) { const x = (i / 512) - 1; c[i] = Math.tanh(x * amt); } s.curve = c; return s; };

    let bus = null, beat = null, timer = 0, step = 0, nextT = 0, startPos = 0, startCtx = 0, playing = false;
    const eng = { analyser, ctx, onEnd: null };

    const env = (g, t, a, peak, d) => { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); };
    function kick808(t, midi, len) {
      const o = ctx.createOscillator(), g = ctx.createGain(), sh = shaper(2.2), f = mtof(midi);
      o.type = "sine"; o.frequency.setValueAtTime(f * 4, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.06);
      env(g, t, 0.004, 0.9, len); o.connect(sh).connect(g).connect(bus); o.start(t); o.stop(t + len + 0.05);
    }
    function snare(t, clap) {
      const n = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), g = ctx.createGain();
      n.buffer = noise; bp.type = "bandpass"; bp.frequency.value = clap ? 1400 : 2000; bp.Q.value = clap ? 1.2 : 0.8;
      if (clap) { g.gain.setValueAtTime(0.0001, t); [0, 0.012, 0.024].forEach((d) => { g.gain.setValueAtTime(0.55, t + d); g.gain.exponentialRampToValueAtTime(0.05, t + d + 0.01); }); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22); }
      else env(g, t, 0.002, 0.5, 0.18);
      n.connect(bp).connect(g).connect(bus); n.start(t); n.stop(t + 0.3);
      if (!clap) { const o = ctx.createOscillator(), og = ctx.createGain(); o.type = "triangle"; o.frequency.setValueAtTime(190, t); env(og, t, 0.002, 0.3, 0.08); o.connect(og).connect(bus); o.start(t); o.stop(t + 0.12); }
    }
    function hat(t, open, vel = 1) {
      const n = ctx.createBufferSource(), hp = ctx.createBiquadFilter(), g = ctx.createGain();
      n.buffer = noise; hp.type = "highpass"; hp.frequency.value = 7500;
      env(g, t, 0.001, 0.16 * vel, open ? 0.22 : 0.04); n.connect(hp).connect(g).connect(bus); n.start(t); n.stop(t + 0.3);
    }
    function chord(t, notes, len, bright) {
      const lp = ctx.createBiquadFilter(), g = ctx.createGain(); lp.type = "lowpass"; lp.frequency.value = bright ? 1800 : 1100; lp.Q.value = 0.7;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.05, t + 0.08); g.gain.setValueAtTime(0.05, t + len - 0.15); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
      lp.connect(g).connect(bus);
      notes.forEach((m) => [-7, 7].forEach((det) => { const o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.value = mtof(m); o.detune.value = det; o.connect(lp); o.start(t); o.stop(t + len + 0.05); }));
    }
    function pluck(t, midi) {
      const o = ctx.createOscillator(), g = ctx.createGain(), lp = ctx.createBiquadFilter();
      o.type = "triangle"; o.frequency.value = mtof(midi); lp.type = "lowpass"; lp.frequency.value = 2600;
      env(g, t, 0.003, 0.12, 0.35); o.connect(lp).connect(g).connect(bus); o.start(t); o.stop(t + 0.45);
    }

    const sixteenth = () => 60 / beat.bpm / 4;
    function scheduleStep(s, t) {
      const st = STYLES[beat.style], bar = Math.floor(s / 16), pos = s % 16, prog = beat.major ? MAJ : MIN, ch = prog[bar % 4], len = sixteenth();
      const swingT = st.swing && pos % 2 ? t + len * st.swing : t;
      if (pos === 0) chord(t, ch.map((n) => beat.root + 12 + n), len * 16, beat.style === "rnb");
      if (st.kick.includes(pos)) kick808(t, beat.root - 12 + (pos === 10 ? ch[0] + 7 : ch[0]) - (ch[0] > 6 ? 12 : 0), beat.style === "boom" ? 0.35 : len * 5);
      if (st.snare.includes(pos)) snare(t, beat.style !== "boom");
      if (st.hat(pos)) hat(swingT, pos === 6 && beat.style === "rnb", pos % 4 === 0 ? 1 : 0.7);
      if (st.roll.includes(pos)) { hat(t + len / 2, false, 0.6); if (beat.style === "trap" && bar % 2) { hat(t + len / 4, false, 0.5); hat(t + (3 * len) / 4, false, 0.5); } }
      const r = Math.sin((s + 1) * (beat.seed + 3.7)) * 10000, rand = r - Math.floor(r);
      if (pos % 2 === 0 && rand > 0.45 && bar % 4 !== 3) pluck(t, beat.root + 24 + ch[(pos / 2) % ch.length]);
    }
    function tick() {
      while (nextT < ctx.currentTime + 0.12) {
        const songT = startPos + (nextT - startCtx);
        if (songT >= beat.duration) { stopBus(); playing = false; clearInterval(timer); if (eng.onEnd) setTimeout(eng.onEnd, 0); return; }
        scheduleStep(step, nextT); step++; nextT += sixteenth();
      }
    }
    function stopBus() { if (bus) { const b = bus; try { b.gain.setTargetAtTime(0, ctx.currentTime, 0.015); } catch (_) { /* ignore */ } setTimeout(() => b.disconnect(), 120); } bus = null; }
    function startAt(pos) {
      stopBus(); clearInterval(timer);
      bus = ctx.createGain(); bus.connect(master);
      const sx = sixteenth(); step = Math.ceil(pos / sx); startPos = step * sx; startCtx = ctx.currentTime + 0.05; nextT = startCtx;
      playing = true; timer = setInterval(tick, 25); tick();
    }
    eng.play = async (b, pos = 0) => { beat = b; if (ctx.state === "suspended") await ctx.resume(); startAt(pos); };
    eng.pause = async () => { if (!playing) return; await ctx.suspend(); playing = false; };
    eng.resume = async () => { if (!beat) return; await ctx.resume(); playing = true; };
    eng.seek = (pos) => { if (!beat) return; const was = ctx.state; startAt(Math.max(0, Math.min(beat.duration - 0.5, pos))); if (was === "suspended") { playing = false; } };
    eng.stop = () => { stopBus(); clearInterval(timer); playing = false; };
    eng.time = () => (beat ? Math.max(0, Math.min(beat.duration, startPos + (ctx.currentTime - startCtx))) : 0);
    eng.playing = () => playing && ctx.state === "running";
    eng.volume = (v) => { master.gain.setTargetAtTime(v, ctx.currentTime, 0.02); };
    return eng;
  }
  window.Synth = { create, STYLES };
})();
