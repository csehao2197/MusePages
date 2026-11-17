"""Original 24-second mono PCM preview; no samples, speech, or external services."""
import math
import pathlib
import struct
import wave

RATE = 22050
DURATION = 24
DESTINATION = pathlib.Path(__file__).parent / "public" / "audio" / "episode-preview.wav"
CHORDS = [(130.81, 164.81, 196.00, 246.94), (110.00, 130.81, 164.81, 196.00),
          (87.31, 110.00, 130.81, 164.81), (98.00, 123.47, 146.83, 196.00)]


def sample(t):
    chord = CHORDS[int(t // 6) % len(CHORDS)]
    value = 0.0
    for index, frequency in enumerate(chord):
        age = (t - index * 0.17) % 3
        envelope = (1 - math.exp(-age * 65)) * math.exp(-age * 1.65)
        tone = math.sin(2 * math.pi * frequency * t)
        tone += 0.24 * math.sin(2 * math.pi * frequency * 2 * t)
        tone += 0.07 * math.sin(2 * math.pi * frequency * 3 * t)
        value += envelope * tone * 0.085
    pulse_age = t % 0.75
    value += 0.045 * math.sin(2 * math.pi * 65 * t) * math.exp(-pulse_age * 28)
    fade = min(1.0, t / 0.65, (DURATION - t) / 1.3)
    return max(-1, min(1, value * fade))


DESTINATION.parent.mkdir(parents=True, exist_ok=True)
with wave.open(str(DESTINATION), "wb") as audio:
    audio.setnchannels(1)
    audio.setsampwidth(2)
    audio.setframerate(RATE)
    audio.writeframes(b"".join(struct.pack("<h", round(sample(i / RATE) * 32767))
                             for i in range(RATE * DURATION)))
print(f"Original mono PCM: {DURATION}s, {RATE}Hz, {DESTINATION.stat().st_size} bytes")
