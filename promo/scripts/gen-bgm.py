#!/usr/bin/env python3
"""Synthesize an original, license-free light BGM bed: a soft music-box
arpeggio over I-V-vi-IV in C major, plus a gentle low pad. ~64s, calm & airy."""
import numpy as np, wave, struct, os

sr = 44100
def note(name):
    # name like 'C4', 'G4', 'A3', 'F4' -> freq
    names = {'C':0,'C#':1,'D':2,'D#':3,'E':4,'F':5,'F#':6,'G':7,'G#':8,'A':9,'A#':10,'B':11}
    p = name[:-1]; octv = int(name[-1])
    midi = 12*(octv+1) + names[p]
    return 440.0 * 2**((midi-69)/12)

def pluck(freq, dur, amp=0.5):
    t = np.linspace(0, dur, int(sr*dur), endpoint=False)
    # gentle sine + a touch of 2nd harmonic, fast-ish exp decay (music box)
    env = np.exp(-t*4.5)
    wave_ = np.sin(2*np.pi*freq*t) + 0.18*np.sin(2*np.pi*2*freq*t)
    return amp*env*wave_

def pad(freqs, dur, amp=0.10):
    t = np.linspace(0, dur, int(sr*dur), endpoint=False)
    # slow attack/release soft sines
    a = int(sr*0.6); r = int(sr*0.6)
    env = np.ones(len(t))
    env[:a] = np.linspace(0,1,a); env[-r:] = np.linspace(1,0,r)
    sig = sum(np.sin(2*np.pi*f*t) for f in freqs)/len(freqs)
    return amp*env*sig

# progression: C  G  Am  F  (each one bar = 2.0s @ 120bpm)
bar = 2.0
chords = [
    (['C4','E4','G4','C5'], ['C2','G2']),
    (['G3','B3','D4','G4'], ['G2','D3']),
    (['A3','C4','E4','A4'], ['A2','E3']),
    (['F3','A3','C4','F4'], ['F2','C3']),
]
loops = 8  # 8 * 4 bars * 2s = 64s
total = int(sr*bar*4*loops)
L = np.zeros(total); R = np.zeros(total)
eighth = bar/4  # 4 arpeggio notes per bar

pos = 0
for _ in range(loops):
    for arp, low in chords:
        # pad under the whole bar
        p = pad([note(n) for n in low], bar)
        end = pos+len(p)
        if end<=total: L[pos:end]+=p; R[pos:end]+=p
        # arpeggio: 4 eighth notes, ascending, alternating stereo
        for i, nm in enumerate(arp):
            npos = pos + int(sr*eighth*i)
            pk = pluck(note(nm), eighth*1.8, amp=0.42)
            e2 = npos+len(pk)
            if e2>total: pk=pk[:total-npos]; e2=total
            panL = 0.55 if i%2==0 else 0.45
            L[npos:e2]+=pk*panL; R[npos:e2]+=pk*(1-panL)
        pos += int(sr*bar)

# simple stereo delay for air
def delay(x, ms=320, fb=0.28, mix=0.22):
    d=int(sr*ms/1000); y=x.copy()
    for i in range(d,len(x)): y[i]+=fb*y[i-d]
    return (1-mix)*x+mix*y
L=delay(L); R=delay(R)

# gentle global fade in/out + normalize to a calm level
fade=int(sr*1.5)
for ch in (L,R):
    ch[:fade]*=np.linspace(0,1,fade); ch[-fade:]*=np.linspace(1,0,fade)
peak=max(np.max(np.abs(L)),np.max(np.abs(R)),1e-9)
g=0.62/peak  # leave headroom — it's a quiet bed
L*=g; R*=g

inter=np.empty(total*2); inter[0::2]=L; inter[1::2]=R
data=(inter*32767).astype(np.int16)
out_wav="/Users/tao.shen/democra-ai/air-video/public/audio/bgm.wav"
with wave.open(out_wav,'w') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr)
    w.writeframes(struct.pack('<%dh'%len(data), *data))
print("wrote", out_wav, round(total/sr,1), "s")
