import { TestBed, fakeAsync } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';
import { VoiceService, VoiceCommand } from './voice.service';
import { DOCUMENT } from '@angular/common';

/** Minimal SpeechRecognition stub */
function makeSpeechRecognitionStub() {
  return {
    continuous: false,
    lang: '',
    onresult: null as ((e: unknown) => void) | null,
    start: jest.fn(),
    stop: jest.fn(),
  };
}

describe('VoiceService', () => {
  let service: VoiceService;
  let router: Router;
  let recognitionStub: ReturnType<typeof makeSpeechRecognitionStub>;
  let mockWindow: Record<string, unknown>;

  beforeEach(() => {
    recognitionStub = makeSpeechRecognitionStub();
    mockWindow = {
      SpeechRecognition: jest.fn(() => recognitionStub),
      location: { port: '4200' },
    };

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        {
          provide: DOCUMENT,
          useValue: { defaultView: mockWindow },
        },
      ],
    });

    service = TestBed.inject(VoiceService);
    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
  });

  afterEach(() => {
    service.ngOnDestroy();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('start() activates recognition', () => {
    service.start();
    expect(recognitionStub.start).toHaveBeenCalledTimes(1);
    expect(service.isListening).toBe(true);
  });

  it('start() is a no-op when already listening', () => {
    service.start();
    service.start();
    expect(recognitionStub.start).toHaveBeenCalledTimes(1);
  });

  it('stop() deactivates recognition', () => {
    service.start();
    service.stop();
    expect(recognitionStub.stop).toHaveBeenCalledTimes(1);
    expect(service.isListening).toBe(false);
  });

  it('stop() is a no-op when not listening', () => {
    service.stop();
    expect(recognitionStub.stop).not.toHaveBeenCalled();
  });

  function fireResult(transcript: string) {
    recognitionStub.onresult!({
      results: { length: 1, 0: { 0: { transcript }, length: 1 } },
    });
  }

  it('emits navigate command for "go to mars"', fakeAsync(() => {
    const commands: VoiceCommand[] = [];
    service.commands$.subscribe(c => commands.push(c));
    service.start();

    fireResult('go to mars');

    expect(commands).toEqual([{ type: 'navigate', payload: 'mars' }]);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/mars');
  }));

  it('emits navigate command for "show earth"', fakeAsync(() => {
    const commands: VoiceCommand[] = [];
    service.commands$.subscribe(c => commands.push(c));
    service.start();

    fireResult('show earth');

    expect(commands).toEqual([{ type: 'navigate', payload: 'earth' }]);
  }));

  it('emits home command for "back to main"', fakeAsync(() => {
    const commands: VoiceCommand[] = [];
    service.commands$.subscribe(c => commands.push(c));
    service.start();

    fireResult('back to main page');

    expect(commands).toEqual([{ type: 'home' }]);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/galaxy');
  }));

  it('emits sidebar command for "profile"', fakeAsync(() => {
    const commands: VoiceCommand[] = [];
    service.commands$.subscribe(c => commands.push(c));
    service.start();

    fireResult('show profile');

    expect(commands).toEqual([{ type: 'sidebar', payload: 'profile' }]);
  }));

  it('emits gallery command for "images"', fakeAsync(() => {
    const commands: VoiceCommand[] = [];
    service.commands$.subscribe(c => commands.push(c));
    service.start();

    fireResult('show images please');

    expect(commands).toEqual([{ type: 'gallery' }]);
  }));

  it('emits stop command and stops recognition for "shut down"', fakeAsync(() => {
    const commands: VoiceCommand[] = [];
    service.commands$.subscribe(c => commands.push(c));
    service.start();

    fireResult('shut down');

    expect(commands).toEqual([{ type: 'stop' }]);
    expect(service.isListening).toBe(false);
  }));

  it('ngOnDestroy() calls stop()', () => {
    service.start();
    const stopSpy = jest.spyOn(service, 'stop');
    service.ngOnDestroy();
    expect(stopSpy).toHaveBeenCalled();
  });
});

describe('VoiceService — no Speech API', () => {
  it('creates without error when SpeechRecognition is unavailable', () => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        {
          provide: DOCUMENT,
          useValue: { defaultView: { location: { port: '4200' } } },
        },
      ],
    });

    const service = TestBed.inject(VoiceService);
    expect(service).toBeTruthy();
    // start/stop should be no-ops
    expect(() => service.start()).not.toThrow();
    expect(() => service.stop()).not.toThrow();
  });
});
