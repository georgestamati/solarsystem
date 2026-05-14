import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { TitleCasePipe, KeyValuePipe } from '@angular/common';
import { PlanetDataService, Planet } from '../../core/services/planet-data.service';
import { MenuComponent } from '../../shared/components/menu/menu.component';

// Approximate diameters in km for size visualization
const DIAMETER_KM: Record<string, number> = {
  sun:     1392700,
  mercury: 4879,
  venus:   12104,
  earth:   12756,
  mars:    6792,
  jupiter: 142984,
  saturn:  120536,
  uranus:  51118,
  neptune: 49528,
};

@Component({
  selector: 'app-planet-compare',
  standalone: true,
  imports: [MenuComponent, TitleCasePipe, KeyValuePipe],
  templateUrl: './planet-compare.component.html',
  styleUrl: './planet-compare.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanetCompareComponent {
  private readonly data   = inject(PlanetDataService);
  private readonly router = inject(Router);

  /** Direct signal from the httpResource — no Observable bridge needed. */
  readonly allPlanets = this.data.planets;

  readonly selected = signal<string[]>([]);

  readonly selectedPlanets = computed(() =>
    this.selected()
      .map(name => this.allPlanets().find(p => p.name === name))
      .filter((p): p is Planet => !!p)
  );

  readonly maxDiameter = computed(() => {
    const names = this.selected();
    return Math.max(...names.map(n => DIAMETER_KM[n] ?? 12756), 12756);
  });

  toggle(name: string): void {
    this.selected.update(sel => {
      if (sel.includes(name)) return sel.filter(n => n !== name);
      if (sel.length >= 3)    return sel;
      return [...sel, name];
    });
  }

  isSelected(name: string): boolean {
    return this.selected().includes(name);
  }

  relativeSize(name: string): number {
    const d = DIAMETER_KM[name] ?? 12756;
    return Math.max(12, Math.round((d / this.maxDiameter()) * 120));
  }

  descriptionEntries(planet: Planet): { key: string; value: string }[] {
    const desc = planet.description;
    if (!desc) return [];
    return Object.entries(desc).map(([key, value]) => ({ key, value }));
  }

  goBack(): void { this.router.navigateByUrl('/galaxy'); }
}
