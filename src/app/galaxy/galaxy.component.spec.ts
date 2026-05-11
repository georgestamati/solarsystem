import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { of } from 'rxjs';
import { GalaxyComponent } from './galaxy.component';
import { PlanetDataService, SolarSystem } from '../services/planet-data.service';
import { VoiceService } from '../services/voice.service';
import { SessionService } from '../services/session.service';
import { Subject } from 'rxjs';
import { VoiceCommand } from '../services/voice.service';

jest.mock('gsap', () => ({ gsap: { to: jest.fn() } }));

@Component({ standalone: true, template: '' })
class DummyRouteComponent {}

const MOCK_SYSTEM: SolarSystem = {
  title: 'Solar System',
  records: [
    { name: 'sun' },
    { name: 'earth' },
    { name: 'mars', rings: undefined },
    { name: 'saturn', rings: 'yes' },
  ],
};

describe('GalaxyComponent', () => {
  let fixture: ComponentFixture<GalaxyComponent>;
  let component: GalaxyComponent;
  let router: Router;
  let voiceCommands$: Subject<VoiceCommand>;
  let dataSpy: jest.Mocked<PlanetDataService>;
  let voiceSpy: jest.Mocked<VoiceService>;
  let sessionSpy: jest.Mocked<SessionService>;

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

    sessionSpy = {
      checkWelcomeCookie: jest.fn().mockReturnValue(true),
    } as unknown as jest.Mocked<SessionService>;

    await TestBed.configureTestingModule({
      imports: [GalaxyComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([
          { path: 'galaxy', component: DummyRouteComponent },
          { path: ':planet', component: DummyRouteComponent },
          { path: '', component: DummyRouteComponent },
        ]),
        { provide: PlanetDataService, useValue: dataSpy },
        { provide: VoiceService, useValue: voiceSpy },
        { provide: SessionService, useValue: sessionSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GalaxyComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads all planets from PlanetDataService', () => {
    expect(component.planets()).toHaveLength(4);
  });

  it('excludes the sun from orbitPlanets', () => {
    expect(component.orbitPlanets().map(p => p.name)).not.toContain('sun');
    expect(component.orbitPlanets()).toHaveLength(3);
  });

  it('calls checkWelcomeCookie on init', () => {
    expect(sessionSpy.checkWelcomeCookie).toHaveBeenCalledTimes(1);
  });

  it('starts voice on init', () => {
    expect(voiceSpy.start).toHaveBeenCalledTimes(1);
  });

  it('navigate() calls router.navigateByUrl', () => {
    component.navigate('mars');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/mars');
  });

  it('voice navigate command routes to planet', () => {
    voiceCommands$.next({ type: 'navigate', payload: 'saturn' });
    expect(router.navigateByUrl).toHaveBeenCalledWith('/saturn');
  });

  it('voice command with no payload does not navigate', () => {
    voiceCommands$.next({ type: 'navigate' });
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it('stops voice on destroy', () => {
    component.ngOnDestroy();
    expect(voiceSpy.stop).toHaveBeenCalledTimes(1);
  });
});
