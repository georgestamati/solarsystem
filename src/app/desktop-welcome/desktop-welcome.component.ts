import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-desktop-welcome',
  standalone: true,
  templateUrl: './desktop-welcome.component.html',
  styleUrl: './desktop-welcome.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesktopWelcomeComponent implements OnInit {
  private readonly session = inject(SessionService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.session.checkWelcomeCookie();
  }

  enter(): void {
    this.router.navigateByUrl('/galaxy');
  }
}
