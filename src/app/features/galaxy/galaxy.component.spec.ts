import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { Subject } from 'rxjs';
import { GalaxyComponent, SpeedMode } from './galaxy.component';
import { PlanetDataService, Planet } from '../../core/services/planet-data.service';
import { VoiceService, VoiceCommand } from '../../core/services/voice.service';
import { SessionService } from '../../core/services/session.service';
import { FullscreenService } from '../../core/services/fullscreen.service';
import { AudioService } from '../../core/services/audio.service';
import { ThemeService } from '../../core/services/theme.service';

const PLANETS: Planet[] = [
  { name: 'sun' },
  { name: 'earth' },
  { name: 'mars' },
];

const makeStubs = () => ({
  data:       { planets: signal(PLANETS) },
  voice:      { commands$: new Subject<VoiceCommand>(), start: jest.fn(), stop: jest.fn() },
  session:    { introSeen: signal(false), markIntroSeen: jest.fn() },
  fullscreen: { isFullscreen: signal(false), toggle: jest.fn() },
  audio:      { isMuted: signal(false), volume: signal(0.3), playClick: jest.fn(), playWhoosh: jest.fn(), toggleMute: jest.fn(), setVolume: jest.fn() },
  theme:      { theme: signal('dark' as 'dark'|'light'), toggle: jest.fn() },
});

describe('GalaxyComponent', () => {
  let fixture: ComponentFixture<GalaxyComponent>;
  let comp: GalaxyComponent;
  let router: Router;
  let stubs: ReturnType<typeof makeStubs>;

  beforeEach(async () => {
    stubs = makeStubs();
    await TestBed.configureTestingModule({
      imports: [GalaxyComponent],
      providers: [provideRouter([]), 
        { provide: PlanetDataService,  useValue: stubs.data },
        { provide: VoiceService,       useValue: stubs.voice },
        { provide: SessionService,     useValue: stubs.session },
        { provide: FullscreenService,  useValue: stubs.fullscreen },
        { provide: AudioService,       useValue: stubs.audio },
        { provide: ThemeService,       useValue: stubs.theme },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(GalaxyComponent);
    comp = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => expect(comp).toBeTruthy());

  it('calls markIntroSeen on construction', () => {
    expect(stubs.session.markIntroSeen).toHaveBeenCalled();
  });

  it('planets signal reflects data service', () => {
    expect(comp.planets()).toEqual(PLANETS);
  });

  it('orbitPlanets excludes the sun', () => {
    const names = comp.orbitPlanets().map(p => p.name);
    expect(names).not.toContain('sun');
    expect(names).toContain('earth');
  });

  it('speedMode defaults to "real"', () => {
    expect(comp.speedMode()).toBe('real');
  });

  it('customSpeed defaults to 1', () => {
    expect(comp.customSpeed()).toBe(1);
  });

  it('setSpeedMode() updates speedMode signal', () => {
    comp.setSpeedMode('uniform');
    expect(comp.speedMode()).toBe('uniform');
    comp.setSpeedMode('custom');
    expect(comp.speedMode()).toBe('custom');
  });

  it('onCustomSpeedChange() updates customSpeed for valid input', () => {
    const event = { target: { value: '2.5' } } as unknown as Event;
    comp.onCustomSpeedChange(event);
    expect(comp.customSpeed()).toBe(2.5);
  });

  it('onCustomSpeedChange() ignores NaN input', () => {
    comp.onCustomSpeedChange({ target: { value: 'abc' } } as unknown as Event);
    expect(comp.customSpeed()).toBe(1);
  });

  it('onCustomSpeedChange() ignores zero', () => {
    comp.onCustomSpeedChange({ target: { value: '0' } } as unknown as Event);
    expect(comp.customSpeed()).toBe(1);
  });

  it('onCustomSpeedChange() ignores negative values', () => {
    comp.onCustomSpeedChange({ target: { value: '-1' } } as unknown as Event);
    expect(comp.customSpeed()).toBe(1);
  });

  it('navigate() calls playClick and navigates', () => {
    const spy = jest.spyOn(router, 'navigateByUrl');
    comp.navigate('mars');
    expect(stubs.audio.playClick).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('/mars');
  });

  it('voice navigate command triggers router navigation', () => {
    const spy = jest.spyOn(router, 'navigateByUrl');
    stubs.voice.commands$.next({ type: 'navigate', payload: 'jupiter' });
    expect(spy).toHaveBeenCalledWith('/jupiter');
  });

  it('voice non-navigate command does not navigate', () => {
    const spy = jest.spyOn(router, 'navigateByUrl');
    stubs.voice.commands$.next({ type: 'home' });
    expect(spy).not.toHaveBeenCalled();
  });
});
