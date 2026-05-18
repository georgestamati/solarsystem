import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SizeComparisonComponent } from './size-comparison.component';

const EARTH_DIAMETER = 12756;

describe('SizeComparisonComponent', () => {
  let fixture: ComponentFixture<SizeComparisonComponent>;
  let comp: SizeComparisonComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SizeComparisonComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(SizeComparisonComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(comp).toBeTruthy());

  it('should have earthSize = 40', () => expect(comp.earthSize).toBe(40));

  // --- relativeSize ---

  it('should return 40 for Earth diameter', () => {
    fixture.componentRef.setInput('diameterKm', EARTH_DIAMETER);
    fixture.detectChanges();
    expect(comp.relativeSize()).toBe(40);
  });

  it('should clamp to 120 for a very large planet (Jupiter ~142984)', () => {
    fixture.componentRef.setInput('diameterKm', 142984);
    fixture.detectChanges();
    expect(comp.relativeSize()).toBe(120);
  });

  it('should clamp to 8 for a very small body', () => {
    fixture.componentRef.setInput('diameterKm', 1);
    fixture.detectChanges();
    expect(comp.relativeSize()).toBe(8);
  });

  it('should compute relativeSize for Mars (~6779)', () => {
    fixture.componentRef.setInput('diameterKm', 6779);
    fixture.detectChanges();
    const ratio = 6779 / EARTH_DIAMETER;
    const expected = Math.min(120, Math.max(8, Math.round(40 * ratio)));
    expect(comp.relativeSize()).toBe(expected);
  });

  // --- ratio label ---

  it('should show "× Earth" when planet is larger than Earth', () => {
    fixture.componentRef.setInput('diameterKm', EARTH_DIAMETER * 2);
    fixture.detectChanges();
    expect(comp.ratio()).toContain('× Earth');
  });

  it('should show "smaller than Earth" when planet is smaller', () => {
    fixture.componentRef.setInput('diameterKm', EARTH_DIAMETER / 2);
    fixture.detectChanges();
    expect(comp.ratio()).toContain('smaller than Earth');
  });

  it('should show "1.0× Earth" for Earth itself', () => {
    fixture.componentRef.setInput('diameterKm', EARTH_DIAMETER);
    fixture.detectChanges();
    expect(comp.ratio()).toBe('1.0× Earth');
  });

  it('ratio should have one decimal place for larger bodies', () => {
    fixture.componentRef.setInput('diameterKm', EARTH_DIAMETER * 11);
    fixture.detectChanges();
    expect(comp.ratio()).toMatch(/^\d+\.\d× Earth$/);
  });

  it('should render planetName input in the template', () => {
    fixture.componentRef.setInput('planetName', 'saturn');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Saturn');
  });
});
