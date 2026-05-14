import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { PlanetImagesService } from '../../core/services/planet-images.service';

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
  readonly images = inject(PlanetImagesService);
  readonly planetName = input<string>('');
  readonly diameterKm = input<number>(EARTH_DIAMETER);

  readonly relativeSize = computed(() => {
    const ratio = this.diameterKm() / EARTH_DIAMETER;
    // Scale: Earth = 40px reference, clamp between 8 and 120px
    return Math.min(120, Math.max(8, Math.round(40 * ratio)));
  });

  readonly earthSize = 40;

  readonly ratio = computed(() => {
    const r =