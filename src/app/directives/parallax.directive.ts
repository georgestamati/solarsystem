import { Directive, ElementRef, HostListener, Input, NgZone } from '@angular/core';
import { gsap } from 'gsap';

@Directive({
  selector: '[appParallax]',
  standalone: true
})
export class ParallaxDirective {
  @Input() appParallaxPlanets = '.planet-wrapper .planet';
  @Input() appParallaxMoons: string[] = [];

  constructor(private el: ElementRef, private zone: NgZone) {}

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    this.zone.runOutsideAngular(() => {
      const host = this.el.nativeElement as HTMLElement;
      const rect = host.getBoundingClientRect();
      const x = e.pageX - rect.left;
      const y = e.pageY - rect.top;
      const w = host.offsetWidth;
      const h = host.offsetHeight;

      gsap.to(this.appParallaxPlanets, {
        x: (x - w / 2) / w * -20,
        y: (y - h / 2) / h * -20,
        duration: 1
      });

      this.appParallaxMoons.forEach((sel, i) => {
        gsap.to(sel, {
          x: (x - w / 2) / w * (-50 - i * 50),
          y: (y - h / 2) / h * (-50 - i * 50),
          duration: 1
        });
      });
    });
  }
}
