import { computed, inject, Injectable, OnDestroy, signal, DOCUMENT } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { map, Subject } from 'rxjs';
import { PlanetDataService } from './planet-data.service';

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
  private readonly listening = signal(false);
  readonly isListening = computed(() => this.listening());

  private readonly router = inject(Router);
  private readonly _doc = inject(DOCUMENT);
  private readonly planetData = inject(PlanetDataService);
  private recognition: SpeechRecognitionLike | null = null;
  private readonly fallbackPlanets = [
    'sun', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune',
  ];
  private readonly planetNames = toSignal(
    this.planetData.getAll().pipe(map((system) => system.records.map((planet) => planet.name))),
    { initialValue: this.fallbackPlanets }
  );

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
    if (!this.recognition || this.isListening()) return;
    this.listening.set(true);
    this.recognition.start();
  }

  stop(): void {
    if (!this.recognition || !this.isListening()) return;
    this.listening.set(false);
    this.recognition.stop();
  }

  private process(text: string): void {
    for (const planet of this.planetNames()) {
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
