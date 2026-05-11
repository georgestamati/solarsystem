import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { PlanetDataService, SolarSystem, Planet } from './planet-data.service';

const MOCK_SYSTEM: SolarSystem = {
  title: 'Solar System',
  records: [
    {
      name: 'earth',
      description: { diameter: '12 742 km' },
      moons: [{ name: 'moon', description: { diameter: '3 474 km' }, pos: { top: '0', left: '0', scale: '1' } }],
      contents: {
        profile: { title: 'Earth' },
        introduction: { title: 'Intro', content: ['Earth is our home.'] },
        description: { title: 'Desc', content: ['A blue planet.'] },
      },
    },
    { name: 'mars', description: { diameter: '6 779 km' } },
  ],
};

describe('PlanetDataService', () => {
  let service: PlanetDataService;
  let httpCtrl: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PlanetDataService);
    httpCtrl = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpCtrl.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll()', () => {
    it('fetches /data/planets.json', () => {
      let result: SolarSystem | undefined;
      service.getAll().subscribe(v => (result = v));

      const req = httpCtrl.expectOne('/data/planets.json');
      expect(req.request.method).toBe('GET');
      req.flush(MOCK_SYSTEM);

      expect(result).toEqual(MOCK_SYSTEM);
    });

    it('shares a single HTTP request across multiple subscribers', () => {
      let a: SolarSystem | undefined;
      let b: SolarSystem | undefined;

      service.getAll().subscribe(v => (a = v));
      service.getAll().subscribe(v => (b = v));

      // Only ONE request should be made (shareReplay)
      httpCtrl.expectOne('/data/planets.json').flush(MOCK_SYSTEM);

      expect(a).toEqual(MOCK_SYSTEM);
      expect(b).toEqual(MOCK_SYSTEM);
    });
  });

  describe('getPlanet()', () => {
    it('returns the matching planet by name', () => {
      let result: Planet | undefined;
      service.getPlanet('earth').subscribe(v => (result = v));

      httpCtrl.expectOne('/data/planets.json').flush(MOCK_SYSTEM);

      expect(result?.name).toBe('earth');
    });

    it('returns undefined for an unknown planet name', () => {
      let result: Planet | undefined = { name: 'sentinel' } as Planet;
      service.getPlanet('pluto').subscribe(v => (result = v));

      httpCtrl.expectOne('/data/planets.json').flush(MOCK_SYSTEM);

      expect(result).toBeUndefined();
    });
  });

  describe('error handling', () => {
    it('retries twice, exposes an error signal, and returns fallback data', () => {
      let result: SolarSystem | undefined;
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      service.getAll().subscribe((value) => (result = value));

      httpCtrl.expectOne('/data/planets.json').flush('fail 1', {
        status: 500,
        statusText: 'Server Error',
      });
      httpCtrl.expectOne('/data/planets.json').flush('fail 2', {
        status: 500,
        statusText: 'Server Error',
      });
      httpCtrl.expectOne('/data/planets.json').flush('fail 3', {
        status: 500,
        statusText: 'Server Error',
      });

      expect(service.error()).toBe('Unable to load planet data.');
      expect(result).toEqual({ title: '', records: [] });

      consoleSpy.mockRestore();
    });
  });
});
