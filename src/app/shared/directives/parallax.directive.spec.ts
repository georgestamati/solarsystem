import { Component, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ParallaxDirective } from './parallax.directive';

@Component({
  standalone: true,
  imports: [ParallaxDirective],
  template: `<div appParallax></div>`,
})
class HostComponent {}

describe('ParallaxDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let divEl: HTMLElement;
  let mouseMoveListener: (e: MouseEvent) => void;

  beforeEach(async () => {
    jest.spyOn(window, 'addEventListener').mockImplementation((type, handler) => {
      if (type === 'mousemove') mouseMoveListener = handler as (e: MouseEvent) => void;
    });
    jest.spyOn(window, 'removeEventListener').mockImplementation(() => {});

    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    divEl = fixture.debugElement.query(By.directive(ParallaxDirective)).nativeElement;
  });

  afterEach(() => jest.restoreAllMocks());

  it('should attach the directive to the host element', () => {
    expect(divEl).toBeTruthy();
  });

  it('should register a mousemove listener on window', () => {
    expect(window.addEventListener).toHaveBeenCalledWith(
      'mousemove',
      expect.any(Function),
      { passive: true }
    );
  });

  it('should apply a CSS transform on mousemove', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 1000 });
    Object.defineProperty(window, 'innerHeight', { writable: true, value: 800 });

    mouseMoveListener({ clientX: 500, clientY: 400 } as MouseEvent);

    // At centre: x = 0, y = 0 → rotateX(70) rotateZ(0) scale3d(1,1,1)
    expect(divEl.style.transform).toContain('rotateX(');
    expect(divEl.style.transform).toContain('rotateZ(');
    expect(divEl.style.transform).toContain('scale3d(');
  });

  it('should compute correct rotateX for top-left corner', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 1000 });
    Object.defineProperty(window, 'innerHeight', { writable: true, value: 1000 });

    mouseMoveListener({ clientX: 0, clientY: 0 } as MouseEvent);

    // x = (0/1000 - 0.5) * 6 = -3 → rotateZ(-3deg)
    // y = (0/1000 - 0.5) * 4 = -2 → rotateX(72deg)
    expect(divEl.style.transform).toContain('rotateX(72deg)');
    expect(divEl.style.transform).toContain('rotateZ(-3deg)');
  });

  it('should remove the mousemove listener on destroy', () => {
    fixture.destroy();
    expect(window.removeEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
  });
});
