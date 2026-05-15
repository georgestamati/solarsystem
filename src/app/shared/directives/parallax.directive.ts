import { Directive, DestroyRef, ElementRef, inject } from '@angular/core';

/**
 * Applies a subtle parallax tilt to the galaxy view based on mouse position.
 * Uses GPU-composited transform — no layout reflow.
 */
@Directive({
  selector: '[appParallax]',
  standalone: true,
})
export class ParallaxDirective {
  private readonly el = inject(ElementRef<HTMLElement>);

  constructor() {
    const destroyRef = inject(DestroyRef);

    const onMouseMove = (e: MouseEvent): void => {
      const { innerWidth: w, innerHeight: h } = window;
      const x = (e.clientX / w - 0.5) * 6;
      const y = (e.clientY / h - 0.5) * 4;
      this.el.nativeElement.style.transform =
        `rotateX(${70 - y}deg) rotateZ(${x}deg) scale3d(1,1,1)`;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    destroyRef.onDestroy(() => window.removeEventListener('mousemove', onMouseMove));
  }
}
