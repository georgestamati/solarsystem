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
import { Router } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { PlanetDataService, Planet } from '../services/planet-data.service';
import { KeyboardService } from '../services/keyboard.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

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
  private readonly router = inject(Router);
  private readonly data = inject(PlanetDataService);
  private readonly kb = inject(KeyboardService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly inputRef = viewChild<ElementRef<HTMLInputElement>>('searchInput');
  private focusTimeout?: ReturnType<typeof setTimeout>;

  // Delegate open state to KeyboardService — single source of truth
  readonly isOpen = this.kb.searchOpen;
  readonly query = signal('');
  readonly activeIndex = signal(0);

  private readonly allPlanets = toSignal(
    this.data.getAll().pipe(map(s => s.records)),
    { initialValue: [] as Planet[] }
  );

  readonly results = computed<SearchResult[]>(() => {
    const q = this.query().toLowerCase().trim();
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

  constructor() {
    // Reset active index when results change
    effect(() => {
      this.results();
      this.activeIndex.set(0);
    });

    // When dialog opens, focus input; when it closes, reset query
    effect(() => {
      if (this.isOpen()) {
        this.query.set('');
        // Cancel any pending focus and schedule a fresh one
        clearTimeout(this.focusTimeout);
        this.focusTimeout = setTimeout(() => {
          this.inputRef()?.nativeElement.focus();
        }, 50);
      } else {
        clearTimeout(this.focusTimeout);
        this.query.set('');
      }
    });

    // Cleanup timeout on destroy
    this.destroyRef.onDestroy(() => clearTimeout(this.focusTimeout));
  }

  onInput(e: Event): void {
    this.query.set((e.target as HTMLInputElement).value);
  }

  onKeydown(e: KeyboardEvent): void {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.activeIndex.update(i => Math.min(i + 1, this.results().length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.activeIndex.update(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      this.select(this.results()[this.activeIndex()]);
    }
  }

  select(result: SearchResult | undefined): void {
    if (!result) return;
    this.kb.searchOpen.set(false);
    this.router.navigateByUrl(result.route);
  }

  onBackdropClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('search-backdrop')) {
      this.kb.searchOpen.set(false);
    }
  }
}
