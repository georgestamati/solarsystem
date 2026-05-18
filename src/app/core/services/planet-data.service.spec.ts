import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { PlanetDataService, Planet, SolarSystem } from './planet-data.service';

/** Stub for httpResource */
const mockSolarSystem = (value: SolarSystem | undefined, loading = false, error: unknown = undefined) => ({
  value: signal(value),
  isLoading: signal(loading),
  error: signal(error),
});

jest.mock('@angular/common/http', () => {
  const actual = jest.requireActual('@angular/common/http');
  return {
    ...actual,
    httpResource: jest.fn(),
  };
});

import { httpResource } from '@angular/common/http';

describe('PlanetDataService', () => {
  const samplePlanets: Planet[] = [
    { name: 'earth', diameterKm: 12756 },
    { name: 'mars', diameterKm: 6779 },
  ];
  const sampleSystem: SolarSystem = { title: 'Solar System', records: samplePlanets };

  let stub: ReturnType<typeof mockSolarSystem>;

  beforeEach(() => {
    stub = mockSolarSystem(sampleSystem);
    (httpResource as jest.Mock).mockReturnValue(stub);

    TestBed.configureTestingModule({});
  });

  afterEach(() => jest.restoreAllMocks());

  it('should be created', () => {
    const service = TestBed.inject(PlanetDataService);
    expect(service).toBeTruthy();
  });

  it('should expose planets from solarSystem.value', () => {
    const service = TestBed.inject(PlanetDataService);
    expect(service.planets()).toEqual(samplePlanets);
  });

  it('should return empty array when solarSystem.value is undefined', () => {
    stub = mockSolarSystem(undefined);
    (httpResource as jest.Mock).mockReturnValue(stub);
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const service = TestBed.inject(PlanetDataService);
    expect(service.planets()).toEqual([]);
  });

  it('should expose isLoading signal', () => {
    const service = TestBed.inject(PlanetDataService);
    expect(service.isLoading()).toBe(false);
  });

  it('should expose hasError signal', () => {
    const service = TestBed.inject(PlanetDataService);
    expect(service.hasError()).toBeUndefined();
  });

  it('should find a planet by name', () => {
    const service = TestBed.inject(PlanetDataService);
    expect(service.getPlanet('earth')).toEqual(samplePlanets[0]);
  });

  it('should return undefined for an unknown planet name', () => {
    const service = TestBed.inject(PlanetDataService);
    expect(service.getPlanet('pluto')).toBeUndefined();
  });

  it('should reflect isLoading = true from the resource stub', () => {
    stub = mockSolarSystem(undefined, true);
    (httpResource as jest.Mock).mockReturnValue(stub);
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const service = TestBed.inject(PlanetDataService);
    expect(service.isLoading()).toBe(true);
  });

  it('should reflect error from the resource stub', () => {
    const err = new Error('network error');
    stub = mockSolarSystem(undefined, false, err);
    (httpResource as jest.Mock).mockReturnValue(stub);
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const service = TestBed.inject(PlanetDataService);
    expect(service.hasError()).toBe(err);
  });
});
