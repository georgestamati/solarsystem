import { inject, Injectable } from '@angular/core';
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
