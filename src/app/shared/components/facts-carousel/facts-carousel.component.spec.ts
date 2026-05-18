import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FactsCarouselComponent } from './facts-carousel.component';

const FACTS = ['Fact A', 'Fact B', 'Fact C'];

describe('FactsCarouselComponent (no timers)', () => {
  let fixture: ComponentFixture<FactsCarouselComponent>;
  let comp: FactsCarouselComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactsCarouselComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(FactsCarouselComponent);
    comp = fixture.componentInstance;
  });

  it('should create', () => expect(comp).toBeTruthy());
  it('currentIndex defaults to 0', () => expect(comp.currentIndex()).toBe(0));
  it('isPaused defaults to false', () => expect(comp.isPaused()).toBe(false));
  it('currentFact is empty when no facts', () => expect(comp.currentFact()).toBe(''));

  it('returns first fact when facts provided', () => {
    fixture.componentRef.setInput('facts', FACTS);
    fixture.detectChanges();
    expect(comp.currentFact()).toBe('Fact A');
  });

  it('next() advances index', () => {
    fixture.componentRef.setInput('facts', FACTS);
    fixture.detectChanges();
    comp.next();
    expect(comp.currentIndex()).toBe(1);
    expect(comp.currentFact()).toBe('Fact B');
  });

  it('next() wraps from last to first', () => {
    fixture.componentRef.setInput('facts', FACTS);
    fixture.detectChanges();
    comp.next(); comp.next(); comp.next();
    expect(comp.currentIndex()).toBe(0);
  });

  it('prev() decrements index', () => {
    fixture.componentRef.setInput('facts', FACTS);
    fixture.detectChanges();
    comp.next();
    comp.prev();
    expect(comp.currentIndex()).toBe(0);
  });

  it('prev() wraps from first to last', () => {
    fixture.componentRef.setInput('facts', FACTS);
    fixture.detectChanges();
    comp.prev();
    expect(comp.currentIndex()).toBe(2);
    expect(comp.currentFact()).toBe('Fact C');
  });

  it('next() does not throw when empty', () => expect(() => comp.next()).not.toThrow());
  it('prev() does not throw when empty', () => expect(() => comp.prev()).not.toThrow());

  it('currentFact uses modulo for safety', () => {
    fixture.componentRef.setInput('facts', FACTS);
    fixture.detectChanges();
    comp.currentIndex.set(10);
    expect(comp.currentFact()).toBe('Fact B');
  });
});

describe('FactsCarouselComponent (fake timers)', () => {
  let fixture: ComponentFixture<FactsCarouselComponent>;
  let comp: FactsCarouselComponent;

  // Install fake timers BEFORE the component is created so setInterval is patched
  beforeEach(async () => {
    jest.useFakeTimers();
    await TestBed.configureTestingModule({
      imports: [FactsCarouselComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(FactsCarouselComponent);
    comp = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
    jest.useRealTimers();
  });

  it('auto-advances every 5s when not paused', () => {
    fixture.componentRef.setInput('facts', FACTS);
    fixture.detectChanges();
    expect(comp.currentIndex()).toBe(0);
    jest.advanceTimersByTime(5000);
    expect(comp.currentIndex()).toBe(1);
    jest.advanceTimersByTime(5000);
    expect(comp.currentIndex()).toBe(2);
  });

  it('does not auto-advance when isPaused', () => {
    fixture.componentRef.setInput('facts', FACTS);
    comp.isPaused.set(true);
    fixture.detectChanges();
    jest.advanceTimersByTime(5000);
    expect(comp.currentIndex()).toBe(0);
  });

  it('does not auto-advance with only one fact', () => {
    fixture.componentRef.setInput('facts', ['Only fact']);
    fixture.detectChanges();
    jest.advanceTimersByTime(5000);
    expect(comp.currentIndex()).toBe(0);
  });

  i