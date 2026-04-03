import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

export interface VoiceCommand {
  type: 'navigate' | 'sidebar' | 'gallery' | 'home' | 'stop';
  payload?: string;
}

@Injectable({ providedIn: 'root' })
export class VoiceService implements OnDestroy {
  commands$ = new Subject<VoiceCommand>();
  isListening = false;

  private recognition: any;
  private readonly planets = ['sun','mercury','venus','earth','mars','jupiter','saturn','uranus','neptune'];

  constructor(private zone: NgZone, private router: Router) {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.lang = 'en-US';

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
      this.zone.run(() => this.process(transcript));
    };
  }

  start(): void {
    if (!this.recognition || this.isListening) return;
    this.isListening = true;
    this.recognition.start();
  }

  stop(): void {
    if (!this.recognition || !this.isListening) return;
    this.isListening = false;
    this.recognition.stop();
  }

  private process(text: string): void {
    // "go to [planet]"
    for (const planet of this.planets) {
      if (text.includes(`go to ${planet}`) || text.includes(`show ${planet}`)) {
        this.router.navigateByUrl(`/${planet}`);
        this.commands$.next({ type: 'navigate', payload: planet });
        return;
      }
    }
    // "back to main page"
    if (text.includes('back to main') || text.includes('main page') || text.includes('go back')) {
      this.router.navigateByUrl('/galaxy');
      this.commands$.next({ type: 'home' });
      return;
    }
    // "display [section]"
    for (const section of ['profile', 'intro', 'description', 'facts']) {
      if (text.includes(section)) {
        this.commands$.next({ type: 'sidebar', payload: section });
        return;
      }
    }
    // "images about [planet]"
    if (text.includes('images') || text.includes('gallery')) {
      this.commands$.next({ type: 'gallery' });
      return;
    }
    // "shut down" / "stop"
    if (text.includes('shut down') || text.includes('stop listening')) {
      this.stop();
      this.commands$.next({ type: 'stop' });
    }
  }

  ngOnDestroy(): void {
    this.stop();
  }
}
