import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly cookies = inject(CookieService);
  private readonly router = inject(Router);

  private static readonly COOKIE_KEY = 'welcome';

  /**
   * Call on the welcome component's ngOnInit.
   * Returns true (first visit) — sets the cookie and stays on the page.
   * Returns false (return visit) — navigates to /galaxy immediately.
   */
  checkWelcomeCookie(): boolean {
    if (!this.cookies.check(SessionService.COOKIE_KEY)) {
      this.cookies.set(SessionService.COOKIE_KEY, SessionService.COOKIE_KEY, {
        path: '/',
        expires: 3,
      });
      return true;
    }
    this.router.navigateByUrl('/galaxy');
    return false;
  }
}
