import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { PlanetDataService, Planet, Moon } from '../services/planet-data.service';
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
  private readonly inputRef = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  readonly isOpen = signal(false);
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
    effect(() => {
      // Reset active index whenever results change
      this.results();
      this.activeIndex.set(0);
    });
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      this.open();
      return;
    }
    if (!this.isOpen()) return;

    if (e.key === 'Escape') { this.close(); return; }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.activeIndex.update(i => Math.min(i + 1, this.results().length - 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.activeIndex.update(i => Math.max(i - 1, 0));
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      this.select(this.results()[this.activeIndex()]);
    }
  }

  open(): void {
    this.isOpen.set(true);
    this.query.set('');
    // Focus input after render
    setTimeout(() => this.inputRef()?.nativeElement.focus(), 50);
  }

  close(): void {
    this.isOpen.set(false);
    this.query.set('');
  }

  onInput(e: Event): void {
    this.query.set((e.target as HTMLInputElement).value);
  }

  select(result: SearchResult | undefined): void {
    if (!result) return;
    this.close();
    this.router.navigateByUrl(result.route);
  }

  onBackdropClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('search-backdrop')) {
      this.close();
    }
  }
}
