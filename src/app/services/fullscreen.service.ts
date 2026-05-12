import { inject, Injectable, signal, DOCUMENT } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FullscreenService {
  private readonly doc = inject(DOCUMENT);
  readonly isFullscreen = signal(false);

  constructor() {
    // Keep signal in sync when user presses Escape or uses browser controls.
    this.doc.addEventListener('fullscreenchange', () => {
      this.isFullscreen.set(!!this.doc.fullscreenElement);
    });
  }

  toggle(): void {
    if (!this.doc.fullscreenElement) {
      this.doc.documentElement.requestFullscreen().catch(() => {});
    } else {
      this.doc.exitFullscreen().catch(() => {});
    }
  }
}
