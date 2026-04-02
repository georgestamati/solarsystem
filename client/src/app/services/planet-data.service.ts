import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  constructor(private http: HttpClient) {}

  /** Returns all solar system data from the static asset (no server round-trip). */
  getAll(): Observable<SolarSystem> {
    return this.http.get<SolarSystem>('/data/planets.json');
  }

  /** Returns a single planet from the REST API endpoint. */
  getPlanet(name: string): Observable<Planet> {
    return this.http.get<Planet>(`/api/planets/${name}`);
  }
}
