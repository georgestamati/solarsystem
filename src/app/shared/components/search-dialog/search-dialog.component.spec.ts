import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { SearchDialogComponent } from './search-dialog.component';
import { PlanetDataService, Planet } from '../../../core/services/planet-data.service';
import { KeyboardService } from '../../../core/services/keyboard.service';

const PLANETS: Planet[] = [
  { name: 'earth', moons: [{ name: 'moon', description: {}, pos: { top: '0', left: '0', scale: '1' } }] },
  { name: 'mars', moons: [{ name: 'phobos', description: {}, pos: { top: '0', left: '0', scale: '1' } }] },
  { name: 'saturn' },
];

const makeDataStub = (planets: Planet[] = PLANETS) => ({ planets: signal(planets) });
const makeKbStub = () => ({ searchOpen: signal(false) });
const makeRouter = () => ({ navigateByUrl: jest.fn() });

describe('SearchDialogComponent', () => {
  let fixture: ComponentFixture<SearchDialogComponent>;
  let comp: SearchDialogComponent;
  let kbStub: ReturnType<typeof makeKbStub>;
  let dataStub: ReturnType<typeof makeDataStub>;
  let router: ReturnType<typeof makeRouter>;

  beforeEach(async () => {
    kbStub = makeKbStub();
    dataStub = makeDataStub();
    router = makeRouter();

    await TestBed.configureTestingModule({
      imports: [SearchDialogComponent],
      providers: [
        { provide: PlanetDataService, useValue: dataStub },
        { provide: KeyboardService, useValue: kbStub },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchDialogComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(comp).toBeTruthy());

  // --- default state ---

  it('isOpen should reflect kb.searchOpen', () => {
    expect(comp.isOpen()).toBe(false);
    kbStub.searchOpen.set(true);
    expect(comp.isOpen()).toBe(true);
  });

  it('should list all planets when query is empty', () => {
    expect(comp.results().length).toBe(PLANETS.length);
  });

  // --- filtering ---

  it('should filter planets by name', () => {
    comp.query.set('ear');
    const results = comp.results();
    expect(results.some(r => r.label === 'earth')).toBe(true);
    expect(results.some(r => r.label === 'mars')).toBe(false);
  });

  it('should include moons in results', () => {
    comp.query.set('phobos');
    const results = comp.results();
    expect(results[0].label).toBe('phobos');
    expect(results[0].sublabel).toBe('mars');
  });

  it('should reset activeIndex to 0 when results change', () => {
    comp.activeIndex.set(2);
    comp.query.set('ear'); // triggers results recompute
    // detectChanges runs the effect that resets activeIndex
    fixture.detectChanges();
    expect(comp.activeIndex()).toBe(0);
  });

  // --- close ---

  it('close() should set searchOpen to false', () => {
    kbStub.searchOpen.set(true);
    comp.close();
    expect(kbStub.searchOpen()).toBe(false);
  });

  // --- onBackdropClick ---

  it('onBackdropClick closes when target has search-backdrop class', () => {
    kbStub.searchOpen.set(true);
    const div = document.createElement('div');
    div.classList.add('search-backdrop');
    comp.onBackdropClick({ target: div } as unknown as MouseEvent);
    expect(kbStub.searchOpen()).toBe(false);
  });

  it('onBackdropClick does NOT close when target lacks search-backdrop class', () => {
    kbStub.searchOpen.set(true);
    const div = document.createElement('div');
    comp.onBackdropClick({ target: div } as unknown as MouseEvent);
    expect(kbStub.searchOpen()).toBe(true);
  });

  // --- onInput ---

  it('onInput should update query signal', () => {
    const input = document.createElement('input');
    input.value = 'mars';
    comp.onInput({ target: input } as unknown as Event);
    expect(comp.query()).toBe('mars');
  });

  // --- onKeydown ---

  const kdown = (fixture: ComponentFixture<SearchDialogComponent>, key: string) =>
    fixture.componentInstance.onKeydown({ key, preventDefault: jest.fn() } as unknown as KeyboardEvent);

  it('ArrowDown increments activeIndex', () => {
    comp.activeIndex.set(0);
    kdown(fixture, 'ArrowDown');
    expect(comp.activeIndex()).toBe(1);
  });

  it('ArrowDown wraps around', () => {
    comp.activeIndex.set(PLANETS.length - 1);
    kdown(fixture, 'ArrowDown');
    expect(comp.activeIndex()).toBe(0);
  });

  it('ArrowUp decrements activeIndex', () => {
    comp.activeIndex.set(1);
    kdown(fixture, 'ArrowUp');
    expect(comp.activeIndex()).toBe(0);
  });

  it('ArrowUp wraps around to last', () => {
    comp.activeIndex.set(0);
    kdown(fixture, 'ArrowUp');
    expect(comp.activeIndex()).toBe(PLANETS.length - 1);
  });

  it('Enter navigates to active result and closes', () => {
    comp.activeIndex.set(0);
    kdown(fixture, 'Enter');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/earth');
    expect(kbStub.searchOpen()).toBe(false);
  });

  it('Enter does nothing when no results', () => {
    comp.query.set('zzz_no_match');
    comp.activeIndex.set(0);
    kdown(fixture, 'Enter');
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it('Escape closes the dialog', () => {
    kbStub.searchOpen.set(true);
    kdown(fixture, 'Escape');
    expect(kbStub.searchOpen()).toBe(false);
  });

  // --- select ---

  it('select() navigates and closes', () => {
    comp.select({ label: 'mars', route: '/mars' });
    expect(router.navigateByUrl).toHaveBeenCalledWith('/mars');
    expect(kbStub.searchOpen()).toBe(false);
  });

  // --- effect: clear