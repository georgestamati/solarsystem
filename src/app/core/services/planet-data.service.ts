import { computed, Injectable } from '@angular/core';
import { httpResource } from '@angular/common/http';

export interface PlanetDescription {
  [key: string]: string;
}

export interface PlanetPosition {
  top: string;
  left: string;
  scale: string;
}

export interface Moon {
  name: string;
  description: PlanetDescription;
  pos: PlanetPosition;
}

export interface PlanetContent {
  profile: { title: string };
  introduction: { title: string; content: string[] };
  description: { title: string; content: string[] };
}

export interface Planet {
  name: string;
  description?: PlanetDescription;
  moons?: Moon[];
  pos?: PlanetPosition;
  rings?: string;
  contents?: PlanetContent;
  facts?: string[];
  diameterKm?: number;
}

export interface SolarSystem {
  title: string;
  records: Planet[];
}

@Injectable({ providedIn: 'root' })
export class PlanetDataService {
  /** Reactive HTTP resource — automatically re-fetches if URL signal changes. */
  readonly solarSystem = httpResource<SolarSystem>('/data/planets.json');

  /** Convenience signal: the planet array (empty while loading or on error). */
  readonly planets = computed(() => this.solarSystem.value()?.records ?? []);

  /** True while the initial request is in flight. */
  readonly isLoading = this.solarSystem.isLoading;

  /** Non-null when the request has failed. */
  readonly hasError = this.solarSystem.error;

  /** Look up a single planet by name (undefined while loading). */
  getPlanet(name: string): Planet | undefined {
    return this.planets().find(p => p.name === name);
  }
}
