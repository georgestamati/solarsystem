import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { DecimalPipe, TitleCasePipe } from '@angular/common';

const EARTH_DIAMETER = 12756;

@Component({
  selector: 'app-size-comparison',
  standalone: true,
  imports: [DecimalPipe, TitleCasePipe],
  templateUrl: './size-comparison.component.html',
  styleUrl: './size-comparison.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SizeComparisonComponent {
  readonly planetName = input<string>('');
  readonly diameterKm = input<number>(EARTH_DIAMETER);

  readonly relativeSize = computed(() => {
    const ratio = this.diameterKm() / EARTH_DIAMETER;
    // Scale: Earth = 40px reference, clamp between 8 and 120px
    return Math.min(120, Math.max(8, Math.round(40 * ratio)));
  });

  readonly earthSize = 40;

  readonly ratio = computed(() => {
    const r = this.diameterKm() / EARTH_DIAMETER;
    return r >= 1 ? `${r.toFixed(1)}× Earth` : `${(1 / r).toFixed(1)}× smaller than Earth`;
  });
}
