import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { FullscreenService } from './fullscreen.service';

describe('FullscreenService', () => {
  let service: FullscreenService;
  let mockDoc: Partial<Document>;

  beforeEach(() => {
    mockDoc = {
      fullscreenElement: null,
      documentElement: {
        requestFullscreen: jest.fn().mockResolvedValue(undefined),
        style: {},
      } as unknown as HTMLElement,
      exitFullscreen: jest.fn().mockResolvedValue(undefined),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: DOCUMENT, useValue: mockDoc }],
    });
    service = TestBed.inject(FullscreenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialise isFullscreen to false', () => {
    expect(service.isFullscreen()).toBe(false);
  });

  it('should request fullscreen and set isFullscreen to true when not in fullscreen', () => {
    (mockDoc as any).fullscreenElement = null;
    service.toggle();
    expect(mockDoc.documentElement!.requestFullscreen).toHaveBeenCalled();
    expect(service.isFullscreen()).toBe(true);
  });

  it('should exit fullscreen and set isFullscreen to false when in fullscreen', () => {
    // put the service into fullscreen state
    (mockDoc as any).fullscreenElement = null;
    service.toggle();                     // → enters fullscreen

    (mockDoc as any).fullscreenElement = document.createElement('div');
    service.toggle();                     // → exits fullscreen

    expect(mockDoc.exitFullscreen).toHaveBeenCalled();
    expect(service.isFullscreen()).toBe(false);
  });

  it('should not throw if requestFullscreen rejects', () => {
    (mockDoc.documentElement as any).requestFullscreen = jest
      .fn()
      .mockRejectedValue(new Error('denied'));
    expect(() => service.toggle()).not.toThrow();
  });

  it('should not throw if exitFullscreen rejects', () => {
    (mockDoc as any).fullscreenElement = null;
    service.toggle();
    (mockDoc as any).fullscreenElement = document.createElement('div');
    (mockDoc as any).exitFullscreen = jest.fn().mockRejectedValue(new Error('denied'));
    expect(() => service.toggle()).not.toThrow();
  });
});
