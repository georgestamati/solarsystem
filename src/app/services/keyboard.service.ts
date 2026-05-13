import { inject, Injectable, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { DOCUMENT } from '@angular/common';

const PLANET_ORDER = [
  'sun', 'mercury', 'venus', 'earth', 'mars',
  'jupiter', 'saturn', 'uranus', 'neptune',
];

@Injectable({ providedIn: 'root' })
export class KeyboardService {
  private readonly router = inject(Router);
  private readonly doc = inject(DOCUMENT);

  // Signals dialogs subscribe to instead of registering competing HostListeners
  readonly searchOpen = signal(false);
  readonly helpOpen = signal(false);

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
    // Single authoritative global keydown listener — no competing HostListeners
    this.doc.addEventListener('keydown', (e: KeyboardEvent) => {
      this.handleKey(e);
    });
  }

  private handleKey(e: KeyboardEvent): void {
    const tag = (e.target as HTMLElement).tagName;
    const isInput = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';

    // Ctrl+K — open search (works even in inputs)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      this.searchOpen.set(true);
      return;
    }

    // Escape — close dialogs in priority order
    if (e.key === 'Escape') {
      if (this.searchOpen()) { this.searchOpen.set(false); return; }
      if (this.helpOpen())   { this.helpOpen.set(false);   return; }
      return;
    }

    // All remaining shortcuts are blocked inside text inputs
    if (isInput) return;

    // ? — toggle help dialog
    if (e.key === '?') {
      e.preventDefault();
      this.helpOpen.update(v => !v);
      return;
    }

    // Arrow keys — planet navigation (only when on a planet page)
    if (e.key === 'ArrowLeft')  { e.preventDefault(); this.navigatePrev(); return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); this.navigateNext(); return; }
  }

  navigatePrev(): void {
    const cur = this.currentPlanet();
    if (!cur) return;
    const idx = PLANET_ORDER.indexOf(cur);
    const prev = PLANET_ORDER[idx > 0 ? idx - 1 : PLANET_ORDER.length - 1];
    this.router.navigateByUrl('/' + prev);
  }

  navigateNext(): void {
    const cur = this.currentPlanet();
    if (!cur) return;
    const idx = PLANET_ORDER.indexOf(cur);
    const next = PLANET_ORDER[(idx + 1) % PLANET_ORDER.length];
    this.router.navigateByUrl('/' + next);
  }

  goGalaxy(): void {
    this.router.navigateByUrl('/galaxy');
  }
}
