import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SocketService } from '../services/socket.service';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-mobile-welcome',
  imports: [FormsModule],
  templateUrl: './mobile-welcome.component.html',
  styleUrl: './mobile-welcome.component.scss'
})
export class MobileWelcomeComponent implements OnInit, OnDestroy {
  pinInput = '';
  hasError = false;

  private subs = new Subscription();

  constructor(
    private socket: SocketService,
    private session: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.session.checkWelcomeCookie();
  }

  submit(): void {
    this.hasError = false;
    this.socket.emit('loadKey', { key: this.pinInput });

    const sub = this.socket.on<{ access: string }>('accessKey').subscribe(data => {
      sub.unsubscribe();
      if (data.access === 'granted') {
        this.socket.emit('mobileConnected', { clickButton: '.loader__local-button' });
        this.router.navigateByUrl('/mobile/galaxy');
      } else {
        this.hasError = true;
        setTimeout(() => { this.hasError = false; }, 1000);
      }
    });
    this.subs.add(sub);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
