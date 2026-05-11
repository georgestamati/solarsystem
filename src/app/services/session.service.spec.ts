import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { SessionService } from './session.service';

@Component({ standalone: true, template: '' })
class DummyRouteComponent {}

describe('SessionService', () => {
  let service: SessionService;
  let router: Router;
  let cookieSpy: jest.Mocked<CookieService>;

  beforeEach(() => {
    cookieSpy = {
      check: jest.fn(),
      set: jest.fn(),
    } as unknown as jest.Mocked<CookieService>;

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([
          { path: 'galaxy', component: DummyRouteComponent },
          { path: '', component: DummyRouteComponent },
        ]),
        { provide: CookieService, useValue: cookieSpy },
      ],
    });

    service = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('checkWelcomeCookie()', () => {
    it('sets the cookie and returns true on first visit', () => {
      cookieSpy.check.mockReturnValue(false);

      const result = service.checkWelcomeCookie();

      expect(result).toBe(true);
      expect(cookieSpy.set).toHaveBeenCalledWith('welcome', 'welcome', {
        path: '/',
        expires: 3,
      });
      expect(router.navigateByUrl).not.toHaveBeenCalled();
    });

    it('navigates to /galaxy and returns false on return visit', () => {
      cookieSpy.check.mockReturnValue(true);

      const result = service.checkWelcomeCookie();

      expect(result).toBe(false);
      expect(cookieSpy.set).not.toHaveBeenCalled();
      expect(router.navigateByUrl).toHaveBeenCalledWith('/galaxy');
    });
  });
});
