import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface VoiceCommand {
  type: 'sidebar' | 'gallery' | 'home' | 'navigate';
  payload?: string;
}

/**
 * Thin wrapper around Web Speech API SpeechRecognition.
 * Emits VoiceCommand events on commands$. Silently no-ops when unavailable.
 */
@Injectable({ providedIn: 'root' })
export class VoiceService {
  readonly commands$ = new Subject<VoiceCommand>();

  private recognition: any = null;
  private running = false;

  private getRecognition(): any {
    const SR =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return null;
    if (!this.recognition) {
      this.recognition = new SR();
      this.recognition.continuous = true;
      this.recognition.lang = 'en-US';
      this.recognition.onresult = (event: any) => {
        const t: string =
          event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
        this.handleTranscript(t);
      };
    }
    return this.recognition;
  }

  start(): void {
    const r = this.getRecognition();
    if (!r || this.running) return;
    try { r.start(); this.running = true; } catch { /* already started */ }
  }

  stop(): void {
    if (!this.recognition || !this.running) return;
    try { this.recognition.stop(); this.running = false; } catch { /* already stopped */ }
  }

  private handleTranscript(text: string): void {
    if (text.includes('profile'))      { this.commands$.next({ type: 'sidebar', payload: 'profile' }); return; }
    if (text.includes('introduction')) { this.commands$.next({ type: 'sidebar', payload: 'intro' }); return; }
    if (text.includes('description'))  { this.commands$.next({ type: 'sidebar', payload: 'description' }); return; }
    if (text.includes('gallery'))      { this.commands$.next({ type: 'gallery' }); return; }
    if (text.includes('home') || text.includes('back')) { this.commands$.next({ type: 'home' }); return; }
    const planets = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
    for (const p of planets) {
      if (text.includes(p)) { this.commands$.next({ type: 'navigate', payload: p }); return; }
    }
  }
}
