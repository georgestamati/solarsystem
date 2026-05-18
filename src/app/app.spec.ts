import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { signal } from '@angular/core';
import { App } from './app';
import { KeyboardService } from './core/services/keyboard.service';
import { ThemeService } from './core/services/theme.service';

const makeKbStub = () => ({
  searchOpen: signal(false),
  helpOpen: signal(false),
  currentPlanet: signal(null as string | null),
  navigatePrev: jest.fn(),
  navigateNext: jest.fn(),
});

const makeThemeStub = () => ({
  theme: signal<'dark' | 'light'>('dark'),
  toggle: jest.fn(),
});

describe('App', () => {
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App, RouterTestingModule],
      providers: [
        { provide: KeyboardService, useValue: makeKbStub() },
        { provide: ThemeService, useValue: makeThemeStub() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    fixture.detectChanges();
  });

  it('should create the root component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should contain a router-outlet', () => {
    const outlet = fixture.nativeElement.querySelector('router-outlet');
    expect(outlet).not.toBeNull();
  });
});
