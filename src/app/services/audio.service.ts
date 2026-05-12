import { inject, Injectable, signal, DOCUMENT } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AudioService {
  private readonly doc = inject(DOCUMENT);

  readonly isMuted = signal<boolean>(this.loadMuted());
  readonly volume = signal<number>(this.loadVolume());

  private ctx: AudioContext | null = null;

  private getCtx(): AudioContext | null {
    if (typeof AudioContext === 'undefined') return null;
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  toggleMute(): void {
    this.isMuted.update(m => {
      const next = !m;
      localStorage.setItem('audio-muted', String(next));
      return next;
    });
  }

  setVolume(v: number): void {
    this.volume.set(v);
    localStorage.setItem('audio-volume', String(v));
  }

  /** Short whoosh — played on route transitions */
  playWhoosh(): void {
    if (this.isMuted()) return;
    const ctx = this.getCtx();
    if (!ctx) return;

    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.4, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const t = i / ctx.sampleRate;
      data[i] = (Math.random() * 2 - 1) * Math.exp(-t * 8) * 0.6;
    }

    const src = ctx.createBufferSource();
    src.buffer = buf;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 800;
    filter.Q.value = 0.5;

    const gain = ctx.createGain();
    gain.gain.value = this.volume();

    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start();
  }

  /** Soft click — played when selecting a planet thumbnail */
  playClick(): void {
    if (this.isMuted()) return;
    const ctx = this.getCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(this.volume() * 0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  }

  private loadMuted(): boolean {
    try { return localStorage.getItem('audio-muted') === 'true'; }
    catch { return false; }
  }

  private loadVolume(): number {
    try { return parseFloat(localStorage.getItem('audio-volume') ?? '0.3'); }
    catch { return 0.3; }
  }
}
