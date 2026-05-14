import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-desktop-welcome',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './desktop-welcome.component.html',
  styleUrl: './desktop-welcome.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesktopWelcomeComponent {}
