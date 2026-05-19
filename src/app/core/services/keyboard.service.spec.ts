import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router, NavigationEnd } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Subject } from 'rxjs';
import { KeyboardService } from './keyboard.service';

const PLANET_ORDER = [
  'sun', 'mercury', 'venus', 'earth', 'mars',
  'jupiter', 'saturn', 'uranus', 'neptune',
];

describe('KeyboardService', () => {
  let service: KeyboardService;
  let router: { events: Subject<any>; navigateByUrl: jest.Mock };
  let keyHandler: (e: KeyboardEvent) => void;
  let mockDoc: Partial<Document>;

  beforeEach(() => {
    router = {
      events: new Subject(),
      navigateByUrl: jest.fn(),
    };

    mockDoc = {
      addEventListener: jest.fn((_, handler) => {
        keyHandler = handler as (e: KeyboardEvent) => void;
      }),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        { provide: DOCUMENT, useValue: mockDoc },
      ],
    });

    service = TestBed.inject(KeyboardService);
  });

  const key = (key: string, opts: Partial<KeyboardEvent> = {}, targetTag = 'BODY') => {
    const e = {
      key,
      ctrlKey: false,
      metaKey: false,
      preventDefault: jest.fn(),
      target: { tagName: targetTag },
      ...opts,
    } as unknown as KeyboardEvent;
    keyHandler(e);
    return e;
  };

  it('should be created', () => expect(service).toBeTruthy());

  // --- signals default state ---

  it('searchOpen defaults to false', () => expect(service.searchOpen()).toBe(false));
  it('helpOpen defaults to false', () => expect(service.helpOpen()).toBe(false));
  it('currentPlanet defaults to null', () => expect(service.currentPlanet()).toBeNull());

  // --- currentPlanet via router events ---

  it('should update currentPlanet on NavigationEnd for a known planet', () => {
    router.events.next(new NavigationEnd(1, '/earth', '/earth'));
    expect(service.currentPlanet()).toBe('earth');
  });

  it('should set currentPlanet to null for an unknown route', () => {
    router.events.next(new NavigationEnd(1, '/galaxy', '/galaxy'));
    expect(service.currentPlanet()).toBeNull();
  });

  // --- Ctrl+K toggles search ---

  it('should toggle searchOpen on Ctrl+K', () => {
    key('k', { ctrlKey: true });
    expect(service.searchOpen()).toBe(true);
    key('k', { ctrlKey: true });
    expect(service.searchOpen()).toBe(false);
  });

  it('should toggle searchOpen on Meta+K', () => {
    key('k', { metaKey: true });
    expect(service.searchOpen()).toBe(true);
  });

  it('should preventDefault on Ctrl+K', () => {
    const e = key('k', { ctrlKey: true });
    expect(e.preventDefault).toHaveBeenCalled();
  });

  // --- input elements block most shortcuts ---

  it('should still toggle search when focus is in INPUT', () => {
    key('k', { ctrlKey: true }, 'INPUT');
    expect(service.searchOpen()).toBe(true);
  });

  it('should NOT navigate on ArrowLeft when focus is in TEXTAREA', () => {
    router.events.next(new NavigationEnd(1, '/earth', '/earth'));
    key('ArrowLeft', {}, 'TEXTAREA');
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  // --- Escape ---

  it('should close searchOpen on Escape', () => {
    service.searchOpen.set(true);
    key('Escape');
    expect(service.searchOpen()).toBe(false);
  });

  it('should close helpOpen on Escape when search is not open', () => {
    service.helpOpen.set(true);
    key('Escape');
    expect(service.helpOpen()).toBe(false);
  });

  it('should navigate to /galaxy on Escape when no dialog is open', () => {
    key('Escape');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/galaxy');
  });

  // --- ? toggles help ---

  it('should toggle helpOpen on ?', () => {
    key('?');
    expect(service.helpOpen()).toBe(true);
    key('?');
    expect(service.helpOpen()).toBe(false);
  });

  it('should NOT toggle helpOpen when Ctrl+? is pressed', () => {
    key('?', { ctrlKey: true });
    expect(service.helpOpen()).toBe(false);
  });

  it('should NOT toggle helpOpen when Meta+? is pressed', () => {
    key('?', { metaKey: true });
    expect(service.helpOpen()).toBe(false);
  });

  // --- Arrow navigation ---

  it('should navigate to previous planet on ArrowLeft', () => {
    // PLANET_ORDER: sun(0) mercury(1) venus(2) earth(3) mars(4)...
    // prev of earth(3) = venus(2)
    router.events.next(new NavigationEnd(1, '/earth', '/earth'));
    key('ArrowLeft');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/venus');
  });

  it('should navigate to next planet on ArrowRight', () => {
    router.events.next(new NavigationEnd(1, '/earth', '/earth'));
    key('ArrowRight');
    // next of earth(3) = mars(4)
    expect(router.navigateByUrl).toHaveBeenCalledWith('/mars');
  });

  it('should wrap around to last planet when pressing ArrowLeft on sun', () => {
    router.events.next(new NavigationEnd(1, '/sun', '/sun'));
    key('ArrowLeft');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/neptune');
  });

  it('should wrap around to first planet when pressing ArrowRight on neptune', () => {
    router.events.next(new NavigationEnd(1, '/neptune', '/neptune'));
    key('ArrowRight');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/sun');
  });

  it('should not navigate on ArrowLeft when no planet is active', () => {
    key('ArrowLeft');
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should not navigate on ArrowRight when no planet is active', () => {
    key('ArrowRight');
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  // --- navigatePrev / navigateNext directly ---

  it('navigatePrev should do nothing when currentPlanet is null', () => {
    service.navigatePrev();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it('navigateNext should do nothing when currentPlanet is null', () => {
    service.navigateNext();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  // --- f/F key: no-op (handled in template) ---

  it('should not throw on f key', () => {
    expect(() => {
      dispatch('f');
      dispatch('F');
    }).not.toThrow();
  });

  it('Meta+? should NOT toggle helpOpen', () => {
    dispatch('?', { metaKey: true });
    expect(service.helpOpen()).toBe(false);
  });
});
