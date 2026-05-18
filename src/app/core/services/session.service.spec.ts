import { TestBed } from '@angular/core/testing';
import { SessionService } from './session.service';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialise introSeen to false', () => {
    expect(service.introSeen()).toBe(false);
  });

  it('should set introSeen to true after markIntroSeen()', () => {
    service.markIntroSeen();
    expect(service.introSeen()).toBe(true);
  });

  it('should remain true on repeated calls to markIntroSeen()', () => {
    service.markIntroSeen();
    service.markIntroSeen();
    expect(service.introSeen()).toBe(true);
  });
});
