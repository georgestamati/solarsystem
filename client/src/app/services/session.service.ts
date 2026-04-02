import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DeviceService } from './device.service';

/**
 * Replicates the original cookie-based welcome-screen logic.
 * First visit: sets cookie, shows welcome. Subsequent visits: skip to galaxy.
 */
@Injectable({ providedIn: 'root' })
export class SessionService {
  constructor(
    private cookies: CookieService,
    private router: Router,
    private device: DeviceService
  ) {}

  /**
   * Call on welcome component init.
   * Returns true if the welcome screen should be shown (first visit).
   * Returns false and navigates to galaxy when the cookie already exists.
   */
  checkWelcomeCookie(): boolean {
    const key = this.device.isMobile() ? 'welcomemobile' : 'welcome';
    if (!this.cookies.check(key)) {
      this.cookies.set(key, key, { path: '/', expires: 3 });
      return true;
    }
    this.router.navigateByUrl(this.device.isMobile() ? '/mobile/galaxy' : '/galaxy');
    return false;
  }
}
