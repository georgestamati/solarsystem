import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { PlanetDataService } from '../../../core/services/planet-data.service';
import { KeyboardService } from '../../../core/services/keyboard.service';

interface SearchResult {
  label: string;
  sublabel?: string;
  route: string;
}

@Component({
  selector: 'app-search-dialog',
  standalone: true,
  imports: [TitleCasePipe],
  templateUrl: './search-dialog.component.html',
  styleUrl: './search-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchDialogComponent {
  private readonly router     = inject(Router);
  private readonly data       = inject(PlanetDataService);
  private readonly kb         = inject(KeyboardService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly inputRef   = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  readonly isOpen      = this.kb.searchOpen;
  readonly query       = signal('');
  readonly activeIndex = signal(0);

  /** Direct signal from the httpResource — no Observable bridge needed. */
  private readonly allPlanets = this.data.planets;

  readonly results = computed<SearchResult[]>(() => {
    const q       = this.query().toLowerCase().trim();
    const planets = this.allPlanets();
    if (!q) return planets.map(p => ({ label: p.name, route: '/' + p.name }));
    const out: SearchResult[] = [];
    for (const planet of planets) {
      if (planet.name.includes(q)) {
        out.push({ label: planet.name, route: '/' + planet.name });
      }
      for (const moon of planet.moons ?? []) {
        if (moon.name.includes(q)) {
          out.push({ label: moon.name, sublabel: planet.name, route: '/' + planet.name });
        }
      }
    }
    return out;
  });

  private focusTimeout?: ReturnType<typeof setTimeout>;

  constructor() {
    effect(() => {
      this.results();
      this.activeIndex.set(0);
    });
    effect(() => {
      if (this.isOpen()) {
        this.query.set('');
        this.focusTimeout = setTimeout(() => this.inputRef()?.nativeElement.focus(), 50);
      }
    });
    this.destroyRef.onDestroy(() => clearTimeout(this.focusTimeout));
  }

  close(): void { this.kb.searchOpen.set(false); }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('search-backdrop')) {
      this.close();
    }
  }

  onInput(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  onKeydown(event: KeyboardEvent): void {
    const len = this.results().length;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.activeIndex.update(i => (i + 1) % len);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeIndex.update(i => (i - 1 + len) % len);
    } else if (event.key === 'Enter') {
      const result = this.results()[this.activeIndex()];
      if (result) this.select(result);
    } else if (event.key === 'Escape') {
      this.close();
    }
  }

  select(result: SearchResult): void {
    this.router.navigateByUrl(result.route);
    this.close();
  }
}
