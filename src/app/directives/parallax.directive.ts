import { Directive, ElementRef, inject, input, OnDestroy, OnInit } from '@angular/core';
import { gsap } from 'gsap';

@Directive({
  selector: '[appParallax]',
  standalone: true,
})
export class ParallaxDirective implements OnInit, OnDestroy {
  readonly appParallaxPlanets = input('.planet-wrapper .planet');
  readonly appParallaxMoons = input<string[]>([]);

  private readonly el = inject(ElementRef<HTMLElement>);
  private frameId: number | null = null;
  private latestEvent: MouseEvent | null = null;
  private readonly handleMouseMove = (event: MouseEvent) => {
    this.latestEvent = event;
    if (this.frameId !== null) return;

    const view = this.el.nativeElement.ownerDocument.defaultView;
    if (!view?.requestAnimationFrame) {
      this.flushParallax();
      return;
    }

    this.frameId = view.requestAnimationFrame(() => {
      this.frameId = null;
      this.flushParallax();
    });
  };

  ngOnInit(): void {
    this.el.nativeElement.addEventListener('mousemove', this.handleMouseMove, { passive: true });
  }

  ngOnDestroy(): void {
    this.el.nativeElement.removeEventListener('mousemove', this.handleMouseMove);
    const view = this.el.nativeElement.ownerDocument.defaultView;
    if (this.frameId !== null && view?.cancelAnimationFrame) {
      view.cancelAnimationFrame(this.frameId);
    }
  }

  private flushParallax(): void {
    const e = this.latestEvent;
    if (!e) return;

    const host = this.el.nativeElement;
    const rect = host.getBoundingClientRect();
    const x = e.pageX - rect.left;
    const y = e.pageY - rect.top;
    const w = host.offsetWidth;
    const h = host.offsetHeight;

    gsap.to(this.appParallaxPlanets(), {
      x: ((x - w / 2) / w) * -20,
      y: ((y - h / 2) / h) * -20,
      duration: 1,
    });

    this.appParallaxMoons().forEach((sel, i) => {
      gsap.to(sel, {
        x: ((x - w / 2) / w) * (-50 - i * 50),
        y: ((y - h / 2) / h) * (-50 - i * 50),
        duration: 1,
      });
    });
  }
}
