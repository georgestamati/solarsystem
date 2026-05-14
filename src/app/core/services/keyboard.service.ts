import { inject, Injectable, signal, DOCUMENT } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

const PLANET_ORDER = [
  'sun', 'mercury', 'venus', 'earth', 'mars',
  'jupiter', 'saturn', 'uranus', 'neptune',
];

@Injectable({ providedIn: 'root' })
export class KeyboardService {
  private readonly router = inject(Router);
  private readonly doc    = inject(DOCUMENT);

  /** Whether the search dialog is open. */
  readonly searchOpen = signal(false);
  /** Whether the keyboard help dialog is open. */
  readonly helpOpen   = signal(false);

  /** The current planet name extracted from the URL, or null. */
  readonly currentPlanet = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => {
        const url = (e as NavigationEnd).urlAfterRedirects.slice(1);
        return PLANET_ORDER.includes(url) ? url : null;
      })
    ),
    { initialValue: null as string | null }
  );

  constructor() {
    this.doc.addEventListener('keydown', (e: KeyboardEvent) => this.handleKey(e));
  }

  private handleKey(e: KeyboardEvent): void {
    const tag = (e.target as HTMLElement).tagName;
    const inInput = tag === 'INPUT' || tag === 'TEXTAREA';

    // Ctrl+K — open search (even in input: browser shortcut override)
    if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      this.searchOpen.update(v => !v);
      return;
    }

    if (inInput) return; // remaining shortcuts don't apply inside inputs

    switch (e.key) {
      case 'Escape':
        if (this.searchOpen()) { this.searchOpen.set(false); return; }
        if (this.helpOpen())   { this.helpOpen.set(false);   return; }
        this.router.navigateByUrl('/galaxy');
        break;

      case '?':
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          this.helpOpen.update(v => !v);
        }
        break;

      case 'ArrowLeft':
        this.navigatePrev();
        break;

      case 'ArrowRight':
        this.navigateNext();
        break;

      case 'f':
      case 'F':
        // Fullscreen: handled by FullscreenService directly in the template
        break;
    }
  }

  navigatePrev(): void {
    const cur = this.currentPlanet();
    if (!cur) return;
    const idx  = PLANET_ORDER.indexOf(cur);
    const prev = PLANET_ORDER[idx > 0 ? idx - 1 : PLANET_ORDER.length - 1];
    this.router.navigateByUrl('/' + prev);
  }

  navigateNext(): void {
    const cur = this.currentPlanet();
    if (!cur) return;
    const idx  = PLANET_ORDER.indexOf(cur);
    const next = PLANET_ORDER[(idx + 1) % PLANET_ORDER.length];
    this.router.navigateByUrl('/' + next);
  }

  goGalaxy(): void {
    this.router.navigateByUrl('/galaxy');
  }
}
