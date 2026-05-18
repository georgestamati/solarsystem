import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { AudioService } from './audio.service';

/** Minimal AudioContext stub */
const makeAudioCtx = () => {
  const gain = { gain: { value: 0, setValueAtTime: jest.fn(), exponentialRampToValueAtTime: jest.fn() }, connect: jest.fn() };
  const filter = { type: '', frequency: { value: 0 }, Q: { value: 0 }, connect: jest.fn() };
  const osc = { type: '', frequency: { setValueAtTime: jest.fn(), exponentialRampToValueAtTime: jest.fn() }, connect: jest.fn(), start: jest.fn(), stop: jest.fn() };
  const src = { buffer: null as any, connect: jest.fn(), start: jest.fn() };
  const buf = { getChannelData: jest.fn().mockReturnValue(new Float32Array(44100)) };

  return {
    state: 'suspended' as AudioContextState,
    sampleRate: 44100,
    currentTime: 0,
    destination: {},
    resume: jest.fn().mockResolvedValue(undefined),
    createBuffer: jest.fn().mockReturnValue(buf),
    createBufferSource: jest.fn().mockReturnValue(src),
    createBiquadFilter: jest.fn().mockReturnValue(filter),
    createGain: jest.fn().mockReturnValue(gain),
    createOscillator: jest.fn().mockReturnValue(osc),
    _gain: gain,
    _filter: filter,
    _osc: osc,
    _src: src,
    _buf: buf,
  };
};

describe('AudioService', () => {
  let service: AudioService;
  let mockCtx: ReturnType<typeof makeAudioCtx>;

  beforeEach(() => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => null);
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});

    mockCtx = makeAudioCtx();
    (window as any).AudioContext = jest.fn(() => mockCtx);

    TestBed.configureTestingModule({
      providers: [{ provide: DOCUMENT, useValue: document }],
    });
    service = TestBed.inject(AudioService);
  });

  afterEach(() => jest.restoreAllMocks());

  // --- creation ---

  it('should be created', () => expect(service).toBeTruthy());

  it('should default isMuted to false when localStorage has no value', () => {
    expect(service.isMuted()).toBe(false);
  });

  it('should default volume to 0.3 when localStorage has no value', () => {
    expect(service.volume()).toBe(0.3);
  });

  it('should load isMuted = true from localStorage', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(k =>
      k === 'audio-muted' ? 'true' : null
    );
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: DOCUMENT, useValue: document }],
    });
    const s = TestBed.inject(AudioService);
    expect(s.isMuted()).toBe(true);
  });

  it('should load volume from localStorage', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(k =>
      k === 'audio-volume' ? '0.7' : null
    );
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: DOCUMENT, useValue: document }],
    });
    const s = TestBed.inject(AudioService);
    expect(s.volume()).toBe(0.7);
  });

  it('should return 0.3 when localStorage.getItem throws', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('no storage');
    });
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: DOCUMENT, useValue: document }],
    });
    const s = TestBed.inject(AudioService);
    expect(s.volume()).toBe(0.3);
    expect(s.isMuted()).toBe(false);
  });

  // --- toggleMute ---

  it('should toggle isMuted from false to true', () => {
    service.toggleMute();
    expect(service.isMuted()).toBe(true);
  });

  it('should toggle isMuted back to false', () => {
    service.toggleMute();
    service.toggleMute();
    expect(service.isMuted()).toBe(false);
  });

  it('should persist mute state in localStorage', () => {
    const spy = jest.spyOn(Storage.prototype, 'setItem');
    service.toggleMute();
    expect(spy).toHaveBeenCalledWith('audio-muted', 'true');
  });

  // --- setVolume ---

  it('should update volume signal', () => {
    service.setVolume(0.8);
    expect(service.volume()).toBe(0.8);
  });

  it('should persist volume in localStorage', () => {
    const spy = jest.spyOn(Storage.prototype, 'setItem');
    service.setVolume(0.5);
    expect(spy).toHaveBeenCalledWith('audio-volume', '0.5');
  });

  // --- playWhoosh ---

  it('should not play whoosh when muted', () => {
    service.toggleMute(); // mute
    service.playWhoosh();
    expect((window as any).AudioContext).not.toHaveBeenCalled();
  });

  it('should play whoosh when not muted', () => {
    service.playWhoosh();
    expect(mockCtx.createBuffer).toHaveBeenCalled();
    expect(mockCtx._src.start).toHaveBeenCalled();
  });

  it('should resume a suspended AudioContext on playWhoosh', () => {
    service.playWhoosh();
    expect(mockCtx.resume).toHaveBeenCalled();
  });

  it('should do nothing when AudioContext is unavailable (playWhoosh)', () => {
    delete (window as any).AudioContext;
    expect(() => service.playWhoosh()).not.toThrow();
    (window as any).AudioContext = jest.fn(() => mockCtx);
  });

  // --- playClick ---

  it('should not play click when muted', () => {
    service.toggleMute();
    service.playClick();
    expect(mockCtx.createOscillator).not.toHaveBeenCalled();
  });

  it('should play click when not muted', () => {
    service.playClick();
    expect(mockCtx.createOscillator).toHaveBeenCalled();
    expect(mockCtx._osc.start).toHaveBeenCalled();
  });

  it('should do nothing when AudioContext is unavailable (playClick)', () => {
    delete (window as any).AudioContext;
    expect(() => service.playClick()).not.toThrow();
    (window as any).AudioContext = jest.fn(() => mockCtx);
  });
});
