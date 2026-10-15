import math
import wave
import struct

sample_rate = 22050
duration = 32.0  # seconds
num_samples = int(sample_rate * duration)

# Base tonic: D4 = 293.66 Hz (classic Carnatic flute pitch)
Sa = 293.66
Ri = Sa * (9.0 / 8.0)       # Chathusruthi Rishabham (E4: 330.37 Hz)
Ga = Sa * (5.0 / 4.0)       # Anthara Gandharam (F#4: 367.08 Hz)
Ma = Sa * (4.0 / 3.0)       # Suddha Madhyamam (G4: 391.55 Hz)
Pa = Sa * (3.0 / 2.0)       # Panchamam (A4: 440.49 Hz)
Dha = Sa * (5.0 / 3.0)      # Chathusruthi Dhaivatham (B4: 489.43 Hz)
Ni = Sa * (15.0 / 8.0)      # Kakali Nishadham (C#5: 550.62 Hz)
Sa2 = Sa * 2.0              # Tara Sthayi Sa (D5: 587.33 Hz)
Ri2 = Ri * 2.0
Ga2 = Ga * 2.0
Pa_low = Pa / 2.0
Sa_low = Sa / 2.0

# Melody notes for "Seetha Kalyana Vaibhogame... Rama Kalyana Vaibhogame":
# Traditional Kurinji / Shankarabharanam wedding phrasing:
melody_events = [
    # "See - tha Kal - ya - na"
    (0.0, 1.2, Sa, 0.45),
    (1.2, 0.6, Ri, 0.4),
    (1.8, 0.9, Ga, 0.45),
    (2.7, 1.2, Ma, 0.48),
    (3.9, 1.8, Pa, 0.55),
    # "Vai - bho - ga - me"
    (5.7, 0.8, Dha, 0.5),
    (6.5, 0.8, Pa, 0.48),
    (7.3, 0.8, Ma, 0.45),
    (8.1, 0.8, Ga, 0.42),
    (8.9, 1.0, Ri, 0.4),
    (9.9, 1.8, Sa, 0.45),

    # "Ra - ma Kal - ya - na"
    (12.0, 1.2, Sa, 0.45),
    (13.2, 0.6, Ri, 0.4),
    (13.8, 0.9, Ga, 0.45),
    (14.7, 1.2, Ma, 0.48),
    (15.9, 1.8, Pa, 0.55),
    # "Vai - bho - ga - me"
    (17.7, 0.8, Dha, 0.5),
    (18.5, 0.8, Pa, 0.48),
    (19.3, 0.8, Ma, 0.45),
    (20.1, 0.8, Ga, 0.42),
    (20.9, 1.0, Ri, 0.4),
    (21.9, 2.2, Sa, 0.48),

    # Instrumental gamaka flute flourish (Aasai mugam theme phrase)
    (24.5, 0.6, Pa, 0.38),
    (25.1, 0.6, Dha, 0.4),
    (25.7, 0.8, Sa2, 0.45),
    (26.5, 0.8, Ni, 0.42),
    (27.3, 0.8, Dha, 0.4),
    (28.1, 1.2, Pa, 0.45),
    (29.3, 1.0, Ga, 0.38),
    (30.3, 1.5, Sa, 0.4)
]

# Bell chimes (Talam) at regular rhythmic pulses (every 2 seconds)
bell_times = [0.0, 2.0, 4.0, 6.0, 8.0, 10.0, 12.0, 14.0, 16.0, 18.0, 20.0, 22.0, 24.0, 26.0, 28.0, 30.0]

buffer = [0.0] * num_samples

# 1. Tanpura drone synthesis (Sa - Pa - Sa' - Sa_low)
tanpura_strings = [
    (0.0, Pa_low, 0.12),
    (0.8, Sa, 0.14),
    (1.6, Sa, 0.14),
    (2.4, Sa_low, 0.18)
]
tanpura_cycle = 3.2

t_idx = 0
while t_idx * sample_rate < num_samples:
    cycle_time = (t_idx % tanpura_cycle)
    for offset, freq, amp in tanpura_strings:
        pluck_start = int((t_idx - (t_idx % tanpura_cycle) + offset) * sample_rate)
        if 0 <= pluck_start < num_samples:
            pluck_len = int(3.0 * sample_rate)
            for i in range(pluck_len):
                idx = pluck_start + i
                if idx < num_samples:
                    t = i / sample_rate
                    # Exponential decay pluck envelope
                    env = amp * math.exp(-t * 1.2)
                    # Rich overtones of tanpura string
                    wave_val = (
                        math.sin(2 * math.pi * freq * t) * 0.6 +
                        math.sin(2 * math.pi * freq * 2 * t) * 0.25 +
                        math.sin(2 * math.pi * freq * 3 * t) * 0.1 +
                        math.sin(2 * math.pi * freq * 4 * t) * 0.05
                    )
                    buffer[idx] += wave_val * env
    t_idx += tanpura_cycle

# 2. Bansuri Flute Synth for melody
for start_t, note_dur, freq, volume in melody_events:
    start_samp = int(start_t * sample_rate)
    dur_samp = int(note_dur * sample_rate)
    for i in range(dur_samp):
        idx = start_samp + i
        if idx < num_samples:
            t = i / sample_rate
            # Smooth attack and release envelope
            att = min(1.0, t / 0.12)
            rel = min(1.0, (note_dur - t) / 0.15) if t > (note_dur - 0.15) else 1.0
            env = volume * att * rel

            # Carnatic gamaka (vibrato and gentle pitch grace)
            vibrato = math.sin(2 * math.pi * 5.2 * t) * 3.5  # 5.2 Hz vibrato, +/- 3.5 Hz
            actual_freq = freq + vibrato

            # Flute harmonics (strong fundamental, mellow odd/even harmonics)
            phase = 2 * math.pi * actual_freq * t
            flute_wave = (
                math.sin(phase) * 0.75 +
                math.sin(phase * 2) * 0.18 +
                math.sin(phase * 3) * 0.07
            )
            # Gentle breath warmth
            buffer[idx] += flute_wave * env

# 3. Auspicious Temple Bells / Talam Chime
for b_t in bell_times:
    b_start = int(b_t * sample_rate)
    b_len = int(1.2 * sample_rate)
    bell_freq = 1760.0  # High clear A6 chime
    for i in range(b_len):
        idx = b_start + i
        if idx < num_samples:
            t = i / sample_rate
            env = 0.08 * math.exp(-t * 4.5)
            bell_wave = (
                math.sin(2 * math.pi * bell_freq * t) +
                math.sin(2 * math.pi * (bell_freq * 2.76) * t) * 0.4 +
                math.sin(2 * math.pi * (bell_freq * 5.4) * t) * 0.2
            )
            buffer[idx] += bell_wave * env

# 4. Simple acoustic delay/reverb for ethereal ambience
echo_delay = int(0.24 * sample_rate)
echo_gain = 0.22
for i in range(echo_delay, num_samples):
    buffer[i] += buffer[i - echo_delay] * echo_gain

# Normalize audio
max_val = max(abs(x) for x in buffer) if buffer else 1.0
if max_val > 0:
    scale = 0.85 / max_val
    buffer = [x * scale for x in buffer]

# Write to WAV file
wav_file = wave.open("aasai_mugham_seetha_kalyanam.wav", "w")
wav_file.setnchannels(1)  # Mono
wav_file.setsampwidth(2)  # 16-bit
wav_file.setframerate(sample_rate)

frames = bytearray()
for val in buffer:
    int_val = int(val * 32767.0)
    int_val = max(-32768, min(32767, int_val))
    frames.extend(struct.pack('<h', int_val))

wav_file.writeframes(frames)
wav_file.close()
print("Successfully generated aasai_mugham_seetha_kalyanam.wav")
