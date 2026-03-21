"use client";

import { createContext, useContext, useState, useRef, useCallback, useEffect, type ReactNode } from "react";

interface NatureSoundCtx {
  playing: boolean;
  volume: number;
  start: () => void;
  stop: () => void;
  setVolume: (v: number) => void;
}

const Ctx = createContext<NatureSoundCtx>({ playing: false, volume: 70, start() {}, stop() {}, setVolume() {} });

export function useNatureSound() { return useContext(Ctx); }

export function NatureSoundProvider({ children }: { children: ReactNode }) {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolumeState] = useState(70);
  const ctxRef = useRef<AudioContext | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const birdGainRef = useRef<GainNode | null>(null);

  // Update volume in real time
  useEffect(() => {
    const v = volume / 100;
    if (masterGainRef.current) masterGainRef.current.gain.setTargetAtTime(v * 0.6, masterGainRef.current.context.currentTime, 0.08);
    if (birdGainRef.current) birdGainRef.current.gain.setTargetAtTime(v, birdGainRef.current.context.currentTime, 0.08);
  }, [volume]);

  const start = useCallback(() => {
    if (ctxRef.current) return; // already playing
    const ctx = new AudioContext();
    ctxRef.current = ctx;
    const oscNodes: OscillatorNode[] = [];
    const srcNodes: AudioBufferSourceNode[] = [];

    const masterGain = ctx.createGain();
    masterGain.gain.value = (volume / 100) * 0.6;
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;

    const birdMaster = ctx.createGain();
    birdMaster.gain.value = volume / 100;
    birdMaster.connect(ctx.destination);
    birdGainRef.current = birdMaster;

    /* ─── Waterfall ─── */
    const sr = ctx.sampleRate;
    const len = 3 * sr;

    function makeWaterLayer(lpFreq: number, hpFreq: number, gain: number, lfoRate: number, lfoDepth: number) {
      const buf = ctx.createBuffer(2, len, sr);
      for (let ch = 0; ch < 2; ch++) {
        const d = buf.getChannelData(ch);
        for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      }
      const s = ctx.createBufferSource();
      s.buffer = buf;
      s.loop = true;
      srcNodes.push(s);

      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass"; lp.frequency.value = lpFreq; lp.Q.value = 0.5;
      const hp = ctx.createBiquadFilter();
      hp.type = "highpass"; hp.frequency.value = hpFreq; hp.Q.value = 0.5;
      const g = ctx.createGain();
      g.gain.value = gain;

      const lfoNode = ctx.createOscillator();
      lfoNode.frequency.value = lfoRate;
      oscNodes.push(lfoNode);
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = lfoDepth;
      lfoNode.connect(lfoGain);
      lfoGain.connect(g.gain);

      s.connect(lp); lp.connect(hp); hp.connect(g);
      g.connect(masterGain);
      s.start(); lfoNode.start();
    }

    makeWaterLayer(320, 40, 0.045, 0.08, 0.010);
    makeWaterLayer(900, 200, 0.032, 0.12, 0.008);
    makeWaterLayer(3500, 800, 0.012, 0.18, 0.004);

    /* ─── Birds ─── */
    let alive = true;

    function birdSong(baseFreq: number, vol: number) {
      if (!alive || ctx.state !== "running") return;
      const t = ctx.currentTime;
      const notes = 3 + Math.floor(Math.random() * 3);
      const noteLen = 0.07 + Math.random() * 0.05;
      const gap = 0.015 + Math.random() * 0.015;

      for (let i = 0; i < notes; i++) {
        const nt = t + i * (noteLen + gap);
        const o = ctx.createOscillator();
        o.type = "sine";
        const intervals = [1, 1.125, 1.2, 1.25, 1.33, 1.5];
        const freq = baseFreq * intervals[Math.floor(Math.random() * intervals.length)];
        o.frequency.setValueAtTime(freq, nt);
        o.frequency.linearRampToValueAtTime(freq * 1.08, nt + noteLen * 0.4);
        o.frequency.linearRampToValueAtTime(freq * 0.97, nt + noteLen);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0, nt);
        g.gain.linearRampToValueAtTime(vol, nt + 0.015);
        g.gain.setValueAtTime(vol * 0.85, nt + noteLen * 0.6);
        g.gain.linearRampToValueAtTime(0, nt + noteLen);
        o.connect(g); g.connect(birdMaster);
        o.start(nt); o.stop(nt + noteLen + 0.01);
      }
    }

    function softPeep(vol = 0.018) {
      if (!alive || ctx.state !== "running") return;
      const t = ctx.currentTime;
      const o = ctx.createOscillator();
      o.type = "sine";
      const freq = 2200 + Math.random() * 1000;
      o.frequency.setValueAtTime(freq, t);
      o.frequency.linearRampToValueAtTime(freq * 1.12, t + 0.06);
      o.frequency.linearRampToValueAtTime(freq * 0.95, t + 0.15);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.02);
      g.gain.setValueAtTime(vol * 0.8, t + 0.08);
      g.gain.linearRampToValueAtTime(0, t + 0.18);
      o.connect(g); g.connect(birdMaster);
      o.start(t); o.stop(t + 0.2);
    }

    function whistle() {
      if (!alive || ctx.state !== "running") return;
      const t = ctx.currentTime;
      const o = ctx.createOscillator();
      o.type = "sine";
      const startF = 2800 + Math.random() * 600;
      o.frequency.setValueAtTime(startF, t);
      o.frequency.linearRampToValueAtTime(startF * 0.7, t + 0.25);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.014, t + 0.02);
      g.gain.setValueAtTime(0.012, t + 0.15);
      g.gain.linearRampToValueAtTime(0, t + 0.28);
      o.connect(g); g.connect(birdMaster);
      o.start(t); o.stop(t + 0.3);
    }

    function scheduleBirds(minDelay: number, maxExtra: number) {
      if (!alive) return;
      const delay = minDelay + Math.random() * maxExtra;
      setTimeout(() => {
        if (!alive || ctx.state !== "running") return;
        const r = Math.random();
        if (r < 0.30) birdSong(1800 + Math.random() * 800, 0.018 + Math.random() * 0.010);
        else if (r < 0.50) birdSong(2400 + Math.random() * 600, 0.014 + Math.random() * 0.006);
        else if (r < 0.65) whistle();
        else if (r < 0.82) { softPeep(); setTimeout(() => { if (alive) softPeep(0.012); }, 120 + Math.random() * 80); }
        else softPeep();
        scheduleBirds(minDelay, maxExtra);
      }, delay);
    }
    scheduleBirds(1500, 3000);
    scheduleBirds(2000, 4000);

    cleanupRef.current = () => {
      alive = false;
      srcNodes.forEach((s) => { try { s.stop(); } catch {} });
      oscNodes.forEach((o) => { try { o.stop(); } catch {} });
      ctx.close();
      masterGainRef.current = null;
      birdGainRef.current = null;
    };

    setPlaying(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stop = useCallback(() => {
    cleanupRef.current?.();
    cleanupRef.current = null;
    ctxRef.current = null;
    setPlaying(false);
  }, []);

  const setVolume = useCallback((v: number) => setVolumeState(v), []);

  useEffect(() => {
    return () => { cleanupRef.current?.(); };
  }, []);

  return (
    <Ctx.Provider value={{ playing, volume, start, stop, setVolume }}>
      {children}
    </Ctx.Provider>
  );
}
