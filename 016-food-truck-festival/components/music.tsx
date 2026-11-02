"use client";
import { useEffect, useRef, useState } from "react";
import { Play, Square } from "lucide-react";

export default function MusicPreview({ artist }: { artist: string }) {
  const context = useRef<AudioContext | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  function stop() { if (timer.current) clearTimeout(timer.current); void context.current?.close(); context.current = null; setPlaying(false); }
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); void context.current?.close(); }, []);
  async function play() {
    setError("");
    try {
      const audio = new AudioContext(); context.current = audio; await audio.resume();
      [220, 261.63, 329.63, 293.66, 220, 329.63, 392, 261.63].forEach((frequency, index) => {
        const oscillator = audio.createOscillator(); const gain = audio.createGain();
        oscillator.type = "triangle"; oscillator.frequency.value = frequency;
        const start = audio.currentTime + index * .45;
        gain.gain.setValueAtTime(0, start); gain.gain.linearRampToValueAtTime(.10, start + .02); gain.gain.exponentialRampToValueAtTime(.001, start + .4);
        oscillator.connect(gain); gain.connect(audio.destination); oscillator.start(start); oscillator.stop(start + .42);
      });
      setPlaying(true); timer.current = setTimeout(stop, 4000);
    } catch { stop(); setError("Audio is unavailable in this browser. The artist and schedule preview still work."); }
  }
  return <div className="music-preview"><p className="eyebrow">Fictional artist · {artist}</p><h3>A little rhythm for your day.</h3><p>This original four-second synthesized melody demonstrates the play control. It is not a recording of this artist, a Spotify stream, or a music endorsement.</p><button className="button rose" onClick={() => { if (playing) stop(); else void play(); }}>{playing ? <Square size={18}/> : <Play size={18}/>} {playing ? "Stop demo melody" : "Play demo melody"}</button><p role="status">{playing ? "Playing an original local demo melody…" : "Audio stopped."}</p>{error && <p role="alert" className="error">{error}</p>}</div>;
}
