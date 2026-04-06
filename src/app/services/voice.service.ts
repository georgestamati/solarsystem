import { inject, Injectable, OnDestroy, DOCUMENT } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

export interface VoiceCommand {
  type: 'navigate' | 'sidebar' | 'gallery' | 'home' | 'stop';
  payload?: string;
}

// Web Speech API is not in TypeScript's default lib — declare minimally.
interface SpeechRecognitionResultLike {
  readonly length: number;
  [i: number]: { transcript: string };
}

interface SpeechRecognitionResultListLike {
  readonly length: number;
  [i: number]: SpeechRecognitionResultLike;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  lang: string;
  onresult: ((event: { results: SpeechRecognitionResultListLike }) => void) | null;
  start(): void;
  stop(): void;
}

@Injectable({ providedIn: 'root' })
export class VoiceService implements OnDestroy {
  readonly commands$ = new Subject<VoiceCommand>();
  isListening = false;

  private readonly router = inject(Router);
  private readonly _doc = inject(DOCUMENT);
  private recognition: SpeechRecognitionLike | null = null;

  private readonly planets = [
    'sun', 'mercury', 'venus', 'earth', 'mars',
    'jupiter', 'saturn', 'uranus', 'neptune',
  ] as const;

  constructor() {
    const win = this._doc.defaultView as Record<string, unknown> | null;
    const SR = (win?.['SpeechRecognition'] ?? win?.['webkitSpeechRecognition']) as
      | (new () => SpeechRecognitionLike)
      | undefined;

    if (!SR) return;

    this.recognition = new SR();
    this.recognition.continuous = true;
    this.recognition.lang = 'en-US';
    this.recognition.onresult = event => {
      const transcript =
        (event.results[event.results.length - 1][0].transcript as string)
          .trim()
          .toLowerCase();
      this.process(transcript);
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
    for (const planet of this.planets) {
      if (text.includes(`go to ${planet}`) || text.includes(`show ${planet}`)) {
        this.router.navigateByUrl(`/${planet}`);
        this.commands$.next({ type: 'navigate', payload: planet });
        return;
      }
    }
    if (text.includes('back to main') || text.includes('main page') || text.includes('go back')) {
      this.router.navigateByUrl('/galaxy');
      this.commands$.next({ type: 'home' });
      return;
    }
    for (const section of ['profile', 'intro', 'description', 'facts'] as const) {
      if (text.includes(section)) {
        this.commands$.next({ type: 'sidebar', payload: section });
        return;
      }
    }
    if (text.includes('images') || text.includes('gallery')) {
      this.commands$.next({ type: 'gallery' });
      return;
    }
    if (text.includes('shut down') || text.includes('stop listening')) {
      this.stop();
      this.commands$.next({ type: 'stop' });
    }
  }

  ngOnDestroy(): void {
    this.stop();
  }
}
