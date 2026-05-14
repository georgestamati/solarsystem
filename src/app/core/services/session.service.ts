import { Injectable, signal } from '@angular/core';

/**
 * Tracks lightweight per-session state so components can coordinate
 * without tight coupling.
 */
@Injectable({ providedIn: 'root' })
export class SessionService {
  readonly introSeen = signal(false);

  markIntroSeen(): void {
    this.introSeen.set(true);
  }
}
