import { Component, provideZonelessChangeDetection } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ParallaxDirective } from './parallax.directive';
import { gsap } from 'gsap';

jest.mock('gsap', () => ({
  gsap: { to: jest.fn() },
}));

@Component({
  standalone: true,
  imports: [ParallaxDirective],
  template: `<div appParallax style="width:800px;height:600px"></div>`,
})
class HostComponent {}

describe('ParallaxDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    host = fixture.nativeElement.querySelector('div')!;
  });

  it('should create the directive on the host', () => {
    expect(host).toBeTruthy();
  });

  it('calls gsap.to when mouse moves over host', () => {
    const event = new MouseEvent('mousemove', { pageX: 400, pageY: 300, bubbles: true });
    host.dispatchEvent(event);
    expect(gsap.to).toHaveBeenCalled();
  });
});
