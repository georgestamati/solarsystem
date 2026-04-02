import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DeviceService } from '../services/device.service';

/** Blocks desktop users from mobile routes; redirects them to /. */
export const mobileGuard: CanActivateFn = () => {
  const device = inject(DeviceService);
  const router = inject(Router);
  return device.isMobile() ? true : router.createUrlTree(['/']);
};
