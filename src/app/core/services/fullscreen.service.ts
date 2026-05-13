import { inject, Injectable, signal, DOCUMENT } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FullscreenService {
  private readonly doc = inject(DOCUMENT);

  readonly isFullscreen = signal(false);

  toggle(): void {
    if (!this.doc.fullscreenElement) {
      this.doc.documentElement.requestFullscreen().catch(() => {});
      this.isFullscreen.set(true);
    } else {
      this.doc.exitFullscreen().catch(() => {});
      this.isFullscreen.set(false);
    }
  }
}
