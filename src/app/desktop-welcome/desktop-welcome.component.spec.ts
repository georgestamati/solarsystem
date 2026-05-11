import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { DesktopWelcomeComponent } from './desktop-welcome.component';
import { SessionService } from '../services/session.service';

@Component({ standalone: true, template: '' })
class DummyRouteComponent {}

describe('DesktopWelcomeComponent', () => {
  let fixture: ComponentFixture<DesktopWelcomeComponent>;
  let component: DesktopWelcomeComponent;
  let router: Router;
  let sessionSpy: jest.Mocked<SessionService>;
  let cookieSpy: jest.Mocked<CookieService>;

  beforeEach(async () => {
    sessionSpy = {
      checkWelcomeCookie: jest.fn().mockReturnValue(true),
    } as unknown as jest.Mocked<SessionService>;

    cookieSpy = { check: jest.fn().mockReturnValue(false), set: jest.fn() } as unknown as jest.Mocked<CookieService>;

    await TestBed.configureTestingModule({
      imports: [DesktopWelcomeComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([
          { path: 'galaxy', component: DummyRouteComponent },
          { path: '', component: DummyRouteComponent },
        ]),
        { provide: SessionService, useValue: sessionSpy },
        { provide: CookieService, useValue: cookieSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DesktopWelcomeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('calls checkWelcomeCookie on init', () => {
    expect(sessionSpy.checkWelcomeCookie).toHaveBeenCalledTimes(1);
  });

  it('enter() navigates to /galaxy', () => {
    component.enter();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/galaxy');
  });

  it('renders the Enter button', () => {
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.loader__local-button');
    expect(btn).toBeTruthy();
    expect(btn.textContent?.trim()).toBe('Enter');
  });

  it('clicking Enter button calls enter()', () => {
    const enterSpy = jest.spyOn(component, 'enter');
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.loader__local-button');
    btn.click();
    expect(enterSpy).toHaveBeenCalled();
  });
});
