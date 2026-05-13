import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { Planet } from '../../../core/services/planet-data.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink, TitleCasePipe],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
  readonly planets = input<Planet[]>([]);
}
