import { Directive, ElementRef, HostListener, inject, input } from '@angular/core';
import { gsap } from 'gsap';

@Directive({
  selector: '[appParallax]',
  standalone: true,
})
export class ParallaxDirective {
  readonly appParallaxPlanets = input('.planet-wrapper .planet');
  readonly appParallaxMoons = input<string[]>([]);

  private readonly el = inject(ElementRef<HTMLElement>);

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
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
