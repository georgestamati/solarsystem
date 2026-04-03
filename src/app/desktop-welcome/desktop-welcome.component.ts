import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SocketService } from '../services/socket.service';
import { SessionService } from '../services/session.service';

type ControlMode = 'local' | 'remote' | null;

@Component({
  selector: 'app-desktop-welcome',
  standalone: true,
  templateUrl: './desktop-welcome.component.html',
  styleUrl: './desktop-welcome.component.scss'
})
export class DesktopWelcomeComponent implements OnInit, OnDestroy {
  pin = '';
  controlMode: ControlMode = null;

  private subs = new Subscription();

  constructor(
    private socket: SocketService,
    private session: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.session.checkWelcomeCookie();

    // Receive the 4-digit pairing code from the server
    this.subs.add(
      this.socket.on<{ code: number }>('key').subscribe(data => {
        this.pin = String(data.code);
      })
    );

    // Mobile companion app connected → enter galaxy
    this.subs.add(
      this.socket.on<unknown>('openDesktopApp').subscribe(() => {
        this.router.navigateByUrl('/galaxy');
      })
    );
  }

  chooseControl(mode: 'local' | 'remote'): void {
    this.controlMode = mode;
  }

  goToApp(): void {
    // Brief animation window (matches original 1s timeout)
    setTimeout(() => this.router.navigateByUrl('/galaxy'), 1000);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
