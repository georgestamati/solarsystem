import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { ThemeService } from './theme.service';

const buildDoc = () =>
  ({
    documentElement: { setAttribute: jest.fn() } as unknown as HTMLElement,
  } as unknown as Document);

describe('ThemeService', () => {
  let service: ThemeService;
  let mockDoc: ReturnType<typeof buildDoc>;

  const configure = (stored: string | null, prefersLight = false) => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key =>
      key === 'theme' ? stored : null
    );
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockReturnValue({ matches: prefersLight }),
    });
    mockDoc = buildDoc();
    TestBed.configureTestingModule({
      providers: [{ provide: DOCUMENT, useValue: mockDoc }],
    });
    service = TestBed.inject(ThemeService);
    TestBed.flushEffects();
  };

  afterEach(() => {
    jest.restoreAllMocks();
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    configure('dark');
    expect(service).toBeTruthy();
  });

  it('should load "dark" from localStorage', () => {
    configure('dark');
    expect(service.theme()).toBe('dark');
  });

  it('should load "light" from localStorage', () => {
    configure('light');
    expect(service.theme()).toBe('light');
  });

  it('should fall back to OS preference (light) when no stored value', () => {
    configure(null, true);
    expect(service.theme()).toBe('light');
  });

  it('should fall back to "dark" when OS prefers dark', () => {
    configure(null, false);
    expect(service.theme()).toBe('dark');
  });

  it('should fall back to "dark" when localStorage throws', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('no storage');
    });
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
    mockDoc = buildDoc();
    TestBed.configureTestingModule({
      providers: [{ provide: DOCUMENT, useValue: mockDoc }],
    });
    service = TestBed.inject(ThemeService);
    TestBed.flushEffects();
    expect(service.theme()).toBe('dark');
  });

  it('should toggle from dark to light', () => {
    configure('dark');
    service.toggle();
    expect(service.theme()).toBe('light');
  });

  it('should toggle from light to dark', () => {
    configure('light');
    service.toggle();
    expect(service.theme()).toBe('dark');
  });

  it('should persist theme via effect on toggle', () => {
    configure('dark');
    const spy = jest.spyOn(Storage.prototype, 'setItem');
    service.toggle();
    TestBed.flushEffects();
    expect(spy).toHaveBeenCalledWith('theme', 'light');
  });

  it('should set data-theme on documentElement via effect', () => {
    configure('dark');
    expect(mockDoc.documentElement.setAttribute)
      .toHaveBeenCalledWith('data-theme', 'dark');
  });

  i  it('should fall back to "dark" when matchMedia is undefined', () => {
    Object.defineProperty(window, 'matchMedia', { writable: true, value: undefined });
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
    mockDoc = buildDoc();
    TestBed.configureTestingModule({
      providers: [{ provide: DOCUMENT, useValue: mockDoc }],
    });
    service = TestBed.inject(ThemeService);
    expect(service.theme()).toBe('dark');
  });

  it('should fall back to OS preference when stored value is unknown', () => {
    configure('unknown' as any, true);
    expect(service.theme()).toBe('light');
  });
});
