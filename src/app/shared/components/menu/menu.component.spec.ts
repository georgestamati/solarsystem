import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MenuComponent } from './menu.component';
import { Planet } from '../../../core/services/planet-data.service';

const planets: Planet[] = [
  { name: 'earth' },
  { name: 'mars' },
];

describe('MenuComponent', () => {
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuComponent],
      providers: [provideRouter([])],
    });
    fixture = TestBed.createComponent(MenuComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should default planets input to empty array', () => {
    expect(fixture.componentInstance.planets()).toEqual([]);
  });

  it('should accept a planets input', () => {
    fixture.componentRef.setInput('planets', planets);
    fixture.detectChanges();
    expect(fixture.componentInstance.planets()).toEqual(planets);
  });

  it('should render one link per planet', () => {
    fixture.componentRef.setInput('planets', planets);
    fixture.detectChanges();
    const links = fixture.nativeElement.querySelectorAll('a');
    expect(links.length).toBeGreaterThanOrEqual(planets.length);
  });

  it('should render planet names in title-case', () => {
    fixture.componentRef.setInput('planets', [{ name: 'mercury' }]);
    fixture.detectChanges();
    expect(fixture.nativeElement.textCon