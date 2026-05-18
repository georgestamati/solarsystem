import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { signal } from '@angular/core';
import { Subject } from 'rxjs';
import { PlanetDetailComponent } from './planet-detail.component';
import { PlanetDataService, Planet } from '../../core/services/planet-data.service';
import { VoiceService, VoiceCommand } from '../../core/services/voice.service';

const EARTH: Planet = {
  name: 'earth',
  diameterKm: 12756,
  description: { 'Type': 'Terrestrial', 'Distance from Sun': '149.6M km' },
  facts: ['Earth is the only known planet with life'],
  moons: [{ name: 'moon', description: {}, pos: { top: '0', left: '0', scale: '1' } }],
  contents: {
    profile: { title: 'Profile' },
    introduction: { title: 'Introduction', content: ['Earth intro text'] },
    description: { title: 'Description', content: ['Earth description text'] },
  },
};
const PLANETS = [EARTH, { name: 'mars', diameterKm: 6779 }];

const makeStubs = () => ({
  data:  { planets: signal(PLANETS), getPlanet: jest.fn((n: string) => PLANETS.find(p => p.name === n)) },
  voice: { commands$: new Subject<VoiceCommand>(), start: jest.fn(), stop: jest.fn() },
});

describe('PlanetDetailComponent', () => {
  let fixture: ComponentFixture<PlanetDetailComponent>;
  let comp: PlanetDetailComponent;
  let router: Router;
  let stubs: ReturnType<typeof makeStubs>;

  beforeEach(async () => {
    stubs = makeStubs();

    Object.defineProperty(window, 'speechSynthesis', {
      writable: true,
      value: { speak: jest.fn(), cancel: jest.fn() },
    });
    Object.defineProperty(window, 'SpeechSynthesisUtterance', {
      writable: true,
      value: jest.fn().mockImplementation((t: string) => ({ text: t })),
    });

    await TestBed.configureTestingModule({
      imports: [PlanetDetailComponent, RouterTestingModule],
      providers: [
        { provide: PlanetDataService, useValue: stubs.data },
        { provide: VoiceService,      useValue: stubs.voice },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlanetDetailComponent);
    comp = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.componentRef.setInput('planet', 'earth');
    fixture.detectChanges();
  });

  it('should create', () => expect(comp).toBeTruthy());
  it('starts voice recognition', () => expect(stubs.voice.start).toHaveBeenCalled());

  it('planet() resolves from data service', () => {
    expect(comp.planet()?.name).toBe('earth');
  });

  it('planet() returns null when param is empty', () => {
    fixture.componentRef.setInput('planet', '');
    expect(comp.planet()).toBeNull();
  });

  it('activeTab defaults to null', () => expect(comp.activeTab()).toBeNull());

  it('toggleTab() sets the active tab', () => {
    comp.toggleTab('profile');
    expect(comp.activeTab()).toBe('profile');
  });

  it('toggleTab() on same tab closes it', () => {
    comp.toggleTab('intro');
    comp.toggleTab('intro');
    expect(comp.activeTab()).toBeNull();
  });

  it('hoveredMoon defaults to null', () => expect(comp.hoveredMoon()).toBeNull());

  it('hoverMoon() sets and clears hoveredMoon', () => {
    const moon = EARTH.moons![0];
    comp.hoverMoon(moon);
    expect(comp.hoveredMoon()).toBe(moon);
    comp.hoverMoon(null);
    expect(comp.hoveredMoon()).toBeNull();
  });

  it('moonImageUrl() returns moon.jpg for earth moon', () => {
    expect(comp.moonImageUrl('earth', 'moon')).toBe('url(assets/img/moon.jpg)');
  });

  it('moonImageUrl() returns planet texture for other moons', () => {
    expect(comp.moonImageUrl('mars', 'phobos')).toBe('url(assets/img/mars.jpg)');
  });

  it('openGallery() sets galleryImages and opens modal', () => {
    comp.openGallery();
    expect(comp.galleryImages()).toEqual(['assets/img/earth.jpg']);
    expect(comp.modalOpen()).toBe(true);
  });

  it('openGallery() does nothing when no planet', () => {
    fixture.componentRef.setInput('planet', '');
    fixture.detectChanges();
    comp.openGallery();
    expect(comp.modalOpen()).toBe(false);
  });

  it('closeModal() closes the modal', () => {
    comp.openGallery();
    comp.closeModal();
    expect(comp.modalOpen()).toBe(false);
  });

  it('nextSlide() advances index', () => {
    comp.galleryImages.set(['a', 'b', 'c']);
    comp.nextSlide();
    expect(comp.modalIndex()).toBe(1);
  });

  it('nextSlide() wraps around', () => {
    comp.galleryImages.set(['a', 'b', 'c']);
    comp.modalIndex.set(2);
    comp.nextSlide();
    expect(comp.modalIndex()).toBe(0);
  });

  it('prevSlide() wraps to last', () => {
    comp.galleryImages.set(['a', 'b', 'c']);
    comp.prevSlide();
    expect(comp.modalIndex()).toBe(2);
  });

  it('onModalKeydown Escape closes modal', () => {
    comp.openGallery();
    comp.onModalKeydown({ key: 'Escape' } as KeyboardEvent);
    expect(comp.modalOpen()).toBe(false);
  });

  it('onModalKeydown ArrowLeft calls prevSlide', () => {
    comp.galleryImages.set(['a', 'b', 'c']);
    comp.modalIndex.set(2);
    comp.onModalKeydown({ key: 'ArrowLeft' } as KeyboardEvent);
    expect(comp.modalIndex()).toBe(1);
  });

  it('onModalKeydown ArrowRight calls nextSlide', () => {
    comp.galleryImages.set(['a', 'b', 'c']);
    comp.onModalKeydown({ key: 'ArrowRight' } as KeyboardEvent);
    expect(comp.modalIndex()).toBe(1);
  });

  it('descriptionEntries() returns key/value pairs', () => {
    expect(comp.descriptionEntries()).toContainEqual({ key: 'Type', value: 'Terrestrial' });
  });

  it('descriptionEntries() returns [] for planet without description', () => {
    fixture.componentRef.setInput('planet', 'mars');
    fixture.detectChanges();
    expect(comp.descriptionEntries()).toEqual([]);
  });

  it('navigatePlanet() navigates by url', () => {
    const spy = jest.spyOn(router, 'navigateByUrl');
    comp.navigatePlanet('mars');
    expect(spy).toHaveBeenCalledWith('/mars');
  });

  it('readActiveText() speaks intro content', () => {
    comp.toggleTab('intro');
    comp.readActiveText();
    expect(window.speechSynthesis.speak).toHaveBeenCalled();
  });

  it('readActiveText() speaks description content', () => {
    comp.toggleTab('description');
    comp.readActiveText();
    expect(window.speechSynthesis.speak).toHaveBeenCalled();
  });

  it('readActiveText() does nothing when no tab active', () => {
    (window.speechSynthesis.speak as jest.Mock).mockClear();
    comp.readActiveText();
    expect(window.speechSynthesis.speak).not.toHaveBeenCalled();
  });

  it('readActiveText() does nothing when no planet', () => {
    fixture.componentRef.setInput('planet', '');
    fixture.detectChanges();
    comp.toggleTab('intro');
    (window.speechSynthesis.speak as jest.Mock).mockClear();
    comp.readActiveText();
    expect(window.speechSynthesis.speak).not.toHaveBeenCalled();
  });

  it('voice sidebar command opens tab', () => {
    stubs.voice.commands$.next({ type: 'sidebar', payload: 'profile' });
    expect(comp.activeTab()).toBe('profile');
  });

  it('voice gallery command opens gallery', () => {
    stubs.voice.commands$.next({ type: 'gallery' });
    expect(comp.modalOpen()).toBe(true);
  });

  it('voice home command navigates to galaxy', () => {
    const spy = jest.spyOn(router, 'navigateByUrl');
    stubs.voice.commands$.next({ type: 'home' });
    expect(spy).toHaveBeenCalledWith('/galaxy');
  });

  it('voice navigate command navigates to planet', () => {
    const spy = jest.spyOn(router, 'navigateByUrl');
    stubs.voice.commands$.next({ type: 'navigate', payload: 'mars' });
    expect(spy).toHaveBeenCalledWith('/mars');
  });

  it('effect redirects to galaxy for unknown planet', () => {
    const spy = jest.spyOn(router, 'navigateByUrl');
    fixture.componentRef.setInput('planet', 'pluto');
    TestBed.flushEffects();
    expect(spy).toHaveBeenCalledWith('/galaxy');
  });
});
