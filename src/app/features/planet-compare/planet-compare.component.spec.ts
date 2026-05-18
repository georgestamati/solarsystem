import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { Subject } from 'rxjs';
import { PlanetCompareComponent } from './planet-compare.component';
import { PlanetDataService, Planet } from '../../core/services/planet-data.service';

const PLANETS: Planet[] = [
  { name: 'earth',   description: { 'Type': 'Terrestrial', 'Moons': '1' } },
  { name: 'mars',    description: { 'Type': 'Terrestrial', 'Moons': '2' } },
  { name: 'jupiter', description: { 'Type': 'Gas Giant',   'Moons': '95' } },
  { name: 'saturn' },
];

describe('PlanetCompareComponent', () => {
  let fixture: ComponentFixture<PlanetCompareComponent>;
  let comp: PlanetCompareComponent;
  let router: Router;
  const dataStub = { planets: signal(PLANETS) };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanetCompareComponent],
      providers: [provideRouter([]), { provide: PlanetDataService, useValue: dataStub }],
    }).compileComponents();
    fixture = TestBed.createComponent(PlanetCompareComponent);
    comp = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => expect(comp).toBeTruthy());

  it('allPlanets reflects data service', () => {
    expect(comp.allPlanets()).toEqual(PLANETS);
  });

  it('selected starts empty', () => expect(comp.selected()).toEqual([]));

  it('toggle() adds a planet', () => {
    comp.toggle('earth');
    expect(comp.selected()).toContain('earth');
  });

  it('toggle() removes an already-selected planet', () => {
    comp.toggle('earth');
    comp.toggle('earth');
    expect(comp.selected()).not.toContain('earth');
  });

  it('toggle() caps selection at 3', () => {
    comp.toggle('earth'); comp.toggle('mars'); comp.toggle('jupiter');
    comp.toggle('saturn');
    expect(comp.selected().length).toBe(3);
  });

  it('isSelected() returns true when selected', () => {
    comp.toggle('mars');
    expect(comp.isSelected('mars')).toBe(true);
  });

  it('isSelected() returns false when not selected', () => {
    expect(comp.isSelected('neptune')).toBe(false);
  });

  it('selectedPlanets() returns matched Planet objects', () => {
    comp.toggle('earth');
    expect(comp.selectedPlanets()[0].name).toBe('earth');
  });

  it('maxDiameter() uses Earth as minimum floor', () => {
    expect(comp.maxDiameter()).toBe(12756);
  });

  it('maxDiameter() returns largest selected planet diameter', () => {
    comp.toggle('jupiter');
    expect(comp.maxDiameter()).toBe(142984);
  });

  it('relativeSize() returns at least 12', () => {
    comp.toggle('mercury');
    expect(comp.relativeSize('mercury')).toBeGreaterThanOrEqual(12);
  });

  it('relativeSize() returns 120 for the largest body', () => {
    comp.toggle('jupiter');
    expect(comp.relativeSize('jupiter')).toBe(120);
  });

  it('relativeSize() falls back for unknown planet', () => {
    comp.toggle('earth');
    expect(comp.relativeSize('unknown')).toBeGreaterThanOrEqual(12);
  });

  it('descriptionEntries() returns key/value pairs', () => {
    const entries = comp.descriptionEntries(PLANETS[0]);
    expect(entries).toContainEqual({ key: 'Type', value: 'Terrestrial' });
  });

  it('descriptionEntries() returns [] when no description', () => {
    expect(comp.descriptionEntries(PLANETS[3])).toEqual([]);
  });

  it('goBack() navigates to /galaxy', () => {
    const spy = jest.spyOn(router, 'navigateByUrl');
    comp.goBack();
    expect(spy).toHaveBeenCalledWith('/galaxy');
  });

  i