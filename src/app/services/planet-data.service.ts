import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, retry, shareReplay } from 'rxjs';

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
}

export interface SolarSystem {
  title: string;
  records: Planet[];
}

@Injectable({ providedIn: 'root' })
export class PlanetDataService {
  private readonly http = inject(HttpClient);
  readonly error = signal<string | null>(null);
  private readonly fallbackData: SolarSystem = { title: '', records: [] };

  private readonly solarSystem$ = this.http.get<SolarSystem>('/data/planets.json').pipe(
    retry(2),
    catchError((error) => {
      this.error.set('Unable to load planet data.');
      console.error('Planet data request failed.', error);
      return of(this.fallbackData);
    }),
    shareReplay(1)
  );

  getAll(): Observable<SolarSystem> {
    return this.solarSystem$;
  }

  getPlanet(name: string): Observable<Planet | undefined> {
    return this.solarSystem$.pipe(map((sys) => sys.records.find((p) => p.name === name)));
  }
}
