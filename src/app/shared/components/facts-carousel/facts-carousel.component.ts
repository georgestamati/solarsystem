import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-facts-carousel',
  standalone: true,
  templateUrl: './facts-carousel.component.html',
  styleUrl: './facts-carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FactsCarouselComponent {
  readonly facts = input<string[]>([]);

  readonly currentIndex = signal(0);
  readonly isPaused     = signal(false);

  readonly currentFact = computed(() => {
    const f = this.facts();
    if (!f.length) return '';
    return f[this.currentIndex() % f.length];
  });

  constructor() {
    const destroyRef = inject(DestroyRef);
    const id = setInterval(() => {
      if (!this.isPaused() && this.facts().length > 1) {
        this.currentIndex.update(i => (i + 1) % this.facts().length);
      }
    }, 5000);
    destroyRef.onDestroy(() => clearInterval(id));
  }

  prev(): void {
    const len = this.facts().length;
    if (!len) return;
    this.currentIndex.update(i => (i - 1 + len) % len);
  }

  next(): void {
    const len = this.facts().length;
    if (!len) return;
    this.currentIndex.update(i => (i + 1) % len);
  }
}
