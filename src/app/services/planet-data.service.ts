import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, shareReplay } from 'rxjs';

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
}

export interface SolarSystem {
  title: string;
  records: Planet[];
}

@Injectable({ providedIn: 'root' })
export class PlanetDataService {
  private readonly http = inject(HttpClient);

  // Shared, cached observable — one HTTP request for the lifetime of the app.
  // Data is served from the static asset (public/data/planets.json), so this
  // works with just `ng serve` — no node server required.
  private readonly solarSystem$ = this.http
    .get<SolarSystem>('/data/planets.json')
    .pipe(shareReplay(1));

  getAll(): Observable<SolarSystem> {
    return this.solarSystem$;
  }

  getPlanet(name: string): Observable<Planet | undefined> {
    return this.solarSystem$.pipe(
      map(sys => sys.records.find(p => p.name === name))
    );
  }
}
