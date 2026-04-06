import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';
import { MenuComponent } from './menu.component';
import { Planet } from '../services/planet-data.service';

const PLANETS: Planet[] = [
  { name: 'earth', moons: [{ name: 'moon', description: {}, pos: { top: '0', left: '0', scale: '1' } }] },
  { name: 'mars' },
];

describe('MenuComponent', () => {
  let fixture: ComponentFixture<MenuComponent>;
  let component: MenuComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuComponent],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('planets', PLANETS);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('starts with menu closed', () => {
    expect(component.isOpen()).toBe(false);
  });

  it('toggle() opens the menu', () => {
    component.toggle();
    expect(component.isOpen()).toBe(true);
  });

  it('toggle() closes the menu when open', () => {
    component.toggle();
    component.toggle();
    expect(component.isOpen()).toBe(false);
  });

  it('close() sets isOpen to false', () => {
    component.toggle();
    component.close();
    expect(component.isOpen()).toBe(false);
  });

  it('renders a link for each planet', () => {
    const links: NodeListOf<HTMLAnchorElement> =
      fixture.nativeElement.querySelectorAll('.desktop-menu li a');
    // +1 for Home link
    expect(links.length).toBe(PLANETS.length + 1);
  });

  it('renders moon sub-links for planets that have moons', () => {
    const moonLinks = fixture.nativeElement.querySelectorAll('.dropdown a');
    expect(moonLinks.length).toBe(1); // earth has 1 moon
  });

  it('hamburger button has aria-label', () => {
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.menu__button');
    expect(btn.getAttribute('aria-label')).toBe('Menu');
  });
});
