import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { of, Subject } from 'rxjs';
import { ParamMap, convertToParamMap } from '@angular/router';
import { PlanetDetailComponent } from './planet-detail.component';
import { PlanetDataService, SolarSystem, Planet } from '../services/planet-data.service';
import { VoiceService, VoiceCommand } from '../services/voice.service';

jest.mock('gsap', () => ({ gsap: { to: jest.fn() } }));

@Component({ standalone: true, template: '' })
class DummyRouteComponent {}

const EARTH: Planet = {
  name: 'earth',
  description: { diameter: '12 742 km', gravity: '9.8 m/s²' },
  moons: [
    { name: 'moon', description: { diameter: '3 474 km' }, pos: { top: '10', left: '20', scale: '0.5' } },
  ],
  contents: {
    profile: { title: 'Earth Profile' },
    introduction: { title: 'Introduction', content: ['Earth sentence 1.', 'Earth sentence 2.'] },
    description: { title: 'Description', content: ['Desc sentence 1.'] },
  },
};

const MOCK_SYSTEM: SolarSystem = {
  title: 'Solar System',
  records: [EARTH, { name: 'mars' }],
};

function makeRoute(planet: string) {
  return {
    paramMap: of(convertToParamMap({ planet })),
    snapshot: { paramMap: convertToParamMap({ planet }) },
  };
}

describe('PlanetDetailComponent', () => {
  let fixture: ComponentFixture<PlanetDetailComponent>;
  let component: PlanetDetailComponent;
  let router: Router;
  let voiceCommands$: Subject<VoiceCommand>;
  let dataSpy: jest.Mocked<PlanetDataService>;
  let voiceSpy: jest.Mocked<VoiceService>;

  beforeEach(async () => {
    voiceCommands$ = new Subject<VoiceCommand>();

    dataSpy = {
      getAll: jest.fn().mockReturnValue(of(MOCK_SYSTEM)),
    } as unknown as jest.Mocked<PlanetDataService>;

    voiceSpy = {
      commands$: voiceCommands$,
      start: jest.fn(),
      stop: jest.fn(),
    } as unknown as jest.Mocked<VoiceService>;

    // stub speechSynthesis
    Object.defineProperty(window, 'speechSynthesis', {
      value: { speak: jest.fn(), cancel: jest.fn() },
      configurable: true,
    });
    Object.defineProperty(globalThis, 'SpeechSynthesisUtterance', {
      value: class {
        constructor(public text: string) {}
      },
      configurable: true,
    });

    await TestBed.configureTestingModule({
      imports: [PlanetDetailComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([
          { path: 'galaxy', component: DummyRouteComponent },
          { path: ':planet', component: DummyRouteComponent },
          { path: '', component: DummyRouteComponent },
        ]),
        { provide: ActivatedRoute, useValue: makeRoute('earth') },
        { provide: PlanetDataService, useValue: dataSpy },
        { provide: VoiceService, useValue: voiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlanetDetailComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads the planet from the route param', () => {
    expect(component.planet()?.name).toBe('earth');
  });

  it('populates allPlanets', () => {
    expect(component.allPlanets()).toHaveLength(2);
  });

  it('descriptionEntries() derives key/value pairs from planet description', () => {
    const entries = component.descriptionEntries();
    expect(entries).toEqual(
      expect.arrayContaining([
        { key: 'diameter', value: '12 742 km' },
        { key: 'gravity', value: '9.8 m/s²' },
      ])
    );
  });

  describe('toggleTab()', () => {
    it('opens a tab', () => {
      component.toggleTab('profile');
      expect(component.activeTab()).toBe('profile');
    });

    it('closes the same tab when clicked again', () => {
      component.toggleTab('profile');
      component.toggleTab('profile');
      expect(component.activeTab()).toBeNull();
    });

    it('switches to a different tab', () => {
      component.toggleTab('profile');
      component.toggleTab('intro');
      expect(component.activeTab()).toBe('intro');
    });
  });

  describe('hoverMoon()', () => {
    it('sets the hovered moon', () => {
      component.hoverMoon(EARTH.moons![0]);
      expect(component.hoveredMoon()?.name).toBe('moon');
    });

    it('clears the hovered moon', () => {
      component.hoverMoon(EARTH.moons![0]);
      component.hoverMoon(null);
      expect(component.hoveredMoon()).toBeNull();
    });
  });

  describe('gallery', () => {
    it('openGallery() sets images and opens modal', () => {
      component.openGallery();
      expect(component.modalOpen()).toBe(true);
      expect(component.galleryImages()).toEqual([
        'img/planets/earth.jpg',
        'img/planets/earth_hd.jpg',
      ]);
      expect(component.modalIndex()).toBe(0);
    });

    it('nextSlide() advances index circularly', () => {
      component.openGallery();
      component.nextSlide();
      expect(component.modalIndex()).toBe(1);
      component.nextSlide();
      expect(component.modalIndex()).toBe(0); // wraps
    });

    it('prevSlide() decrements index circularly', () => {
      component.openGallery();
      component.prevSlide();
      expect(component.modalIndex()).toBe(1); // wraps from 0 to last
    });

    it('closeModal() closes the modal', () => {
      component.openGallery();
      component.closeModal();
      expect(component.modalOpen()).toBe(false);
    });
  });

  describe('readActiveText()', () => {
    it('calls speechSynthesis.speak for intro tab', () => {
      component.toggleTab('intro');
      component.readActiveText();
      expect(window.speechSynthesis.speak).toHaveBeenCalled();
    });

    it('does nothing for profile tab', () => {
      component.toggleTab('profile');
      component.readActiveText();
      expect(window.speechSynthesis.speak).not.toHaveBeenCalled();
    });

    it('does nothing when no tab is active', () => {
      component.readActiveText();
      expect(window.speechSynthesis.speak).not.toHaveBeenCalled();
    });
  });

  describe('voice commands', () => {
    it('sidebar command toggles active tab', () => {
      voiceCommands$.next({ type: 'sidebar', payload: 'description' });
      expect(component.activeTab()).toBe('description');
    });

    it('gallery command opens gallery', () => {
      voiceCommands$.next({ type: 'gallery' });
      expect(component.modalOpen()).toBe(true);
    });

    it('home command navigates to /galaxy', () => {
      voiceCommands$.next({ type: 'home' });
      expect(router.navigateByUrl).toHaveBeenCalledWith('/galaxy');
    });

    it('navigate command routes to planet', () => {
      voiceCommands$.next({ type: 'navigate', payload: 'mars' });
      expect(router.navigateByUrl).toHaveBeenCalledWith('/mars');
    });
  });

  describe('unknown planet', () => {
    it('redirects to /galaxy when planet is not found', async () => {
      TestBed.resetTestingModule();

      await TestBed.configureTestingModule({
        imports: [PlanetDetailComponent],
        providers: [
          provideZonelessChangeDetection(),
          provideRouter([
            { path: 'galaxy', component: DummyRouteComponent },
            { path: ':planet', component: DummyRouteComponent },
            { path: '', component: DummyRouteComponent },
          ]),
          { provide: ActivatedRoute, useValue: makeRoute('pluto') },
          { provide: PlanetDataService, useValue: dataSpy },
          { provide: VoiceService, useValue: voiceSpy },
        ],
      }).compileComponents();

      const r = TestBed.inject(Router);
      jest.spyOn(r, 'navigateByUrl').mockResolvedValue(true);
      const f = TestBed.createComponent(PlanetDetailComponent);
      f.detectChanges();

      expect(r.navigateByUrl).toHaveBeenCalledWith('/galaxy');
    });
  });

  it('stops voice and cancels speech on destroy', () => {
    component.ngOnDestroy();
    expect(voiceSpy.stop).toHaveBeenCalled();
    expect(window.speechSynthesis.cancel).toHaveBeenCalled();
  });
});
