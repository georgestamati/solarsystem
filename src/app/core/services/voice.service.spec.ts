import { TestBed } from '@angular/core/testing';
import { VoiceService, VoiceCommand } from './voice.service';

/** Build a minimal SpeechRecognition stub */
const buildSR = () => {
  const instance = {
    continuous: false,
    lang: '',
    onresult: null as any,
    start: jest.fn(),
    stop: jest.fn(),
  };
  return { ctor: jest.fn(() => instance), instance };
};

describe('VoiceService', () => {
  let service: VoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoiceService);
  });

  afterEach(() => {
    delete (window as any).SpeechRecognition;
    delete (window as any).webkitSpeechRecognition;
    jest.restoreAllMocks();
  });

  it('should be created', () => expect(service).toBeTruthy());

  it('should expose a commands$ Subject', () => {
    expect(service.commands$).toBeDefined();
  });

  // --- start / stop without SR ---

  it('should not throw when SpeechRecognition is unavailable (start)', () => {
    expect(() => service.start()).not.toThrow();
  });

  it('should not throw when SpeechRecognition is unavailable (stop)', () => {
    expect(() => service.stop()).not.toThrow();
  });

  // --- start / stop with SR ---

  it('should start recognition when SR is available', () => {
    const { ctor, instance } = buildSR();
    (window as any).SpeechRecognition = ctor;
    service.start();
    expect(instance.start).toHaveBeenCalled();
  });

  it('should not start twice if already running', () => {
    const { ctor, instance } = buildSR();
    (window as any).SpeechRecognition = ctor;
    service.start();
    service.start();
    expect(instance.start).toHaveBeenCalledTimes(1);
  });

  it('should stop recognition', () => {
    const { ctor, instance } = buildSR();
    (window as any).SpeechRecognition = ctor;
    service.start();
    service.stop();
    expect(instance.stop).toHaveBeenCalled();
  });

  it('should not stop if not running', () => {
    const { ctor, instance } = buildSR();
    (window as any).SpeechRecognition = ctor;
    service.stop();
    expect(instance.stop).not.toHaveBeenCalled();
  });

  it('should survive start() throwing (already-started guard)', () => {
    const { ctor, instance } = buildSR();
    instance.start.mockImplementationOnce(() => { throw new Error('already started'); });
    (window as any).SpeechRecognition = ctor;
    expect(() => service.start()).not.toThrow();
  });

  it('should survive stop() throwing', () => {
    const { ctor, instance } = buildSR();
    (window as any).SpeechRecognition = ctor;
    service.start();
    instance.stop.mockImplementationOnce(() => { throw new Error('already stopped'); });
    expect(() => service.stop()).not.toThrow();
  });

  // --- handleTranscript routing ---

  const fire = (transcript: string): VoiceCommand[] => {
    const { ctor, instance } = buildSR();
    (window as any).SpeechRecognition = ctor;
    service.start();
    const emitted: VoiceCommand[] = [];
    service.commands$.subscribe(c => emitted.push(c));
    const fakeEvent = {
      results: [[{ transcript }]],
    };
    instance.onresult(fakeEvent);
    return emitted;
  };

  it('should emit sidebar:profile on "profile"', () => {
    const cmds = fire('open profile');
    expect(cmds[0]).toEqual({ type: 'sidebar', payload: 'profile' });
  });

  it('should emit sidebar:intro on "introduction"', () => {
    const cmds = fire('show introduction');
    expect(cmds[0]).toEqual({ type: 'sidebar', payload: 'intro' });
  });

  it('should emit sidebar:description on "description"', () => {
    const cmds = fire('read description');
    expect(cmds[0]).toEqual({ type: 'sidebar', payload: 'description' });
  });

  it('should emit gallery on "gallery"', () => {
    const cmds = fire('go to gallery');
    expect(cmds[0]).toEqual({ type: 'gallery' });
  });

  it('should emit home on "home"', () => {
    const cmds = fire('go home');
    expect(cmds[0]).toEqual({ type: 'home' });
  });

  it('should emit home on "back"', () => {
    const cmds = fire('go back');
    expect(cmds[0]).toEqual({ type: 'home' });
  });

  it.each([
    'mercury', 'venus', 'earth', 'mars',
    'jupiter', 'saturn', 'uranus', 'neptune',
  ])('should emit navigate:%s', planet => {
    const cmds = fire(`navigate to ${planet}`);
    expect(cmds[0]).toEqual({ type: 'navigate', payload: planet });
  });

  it('should emit nothing for an unrecognised transcript', () => {
    const cmds = fire('play music');
    expect(cmds).toHaveLength(0);
  });

  it('should use webkitSpeechRecognition as fallback', () => {
    const { ctor } = buildSR();
    (window as any).webkitSpeechRecognition = ctor;
    service.start();
    expect(ctor).toHaveBeenCalled();
  });

  i  it('should reuse the same recognition instance after stop/restart', () => {
    const { ctor } = buildSR();
    (window as any).SpeechRecognition = ctor;
    service.start();
    service.stop();
    service.start();
    expect(ctor).toHaveBeenCalledTimes(1);
  });

  it('stop() does nothing when recognition exists but is not running', () => {
    const { ctor, instance } = buildSR();
    (window as any).SpeechRecognition = ctor;
    // Don't start — running stays false
    service.stop();
    expect(instance.stop).not.toHaveBeenCalled();
  });
});
