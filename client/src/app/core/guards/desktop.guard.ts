import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DeviceService } from '../services/device.service';

/** Blocks mobile users from desktop routes; redirects them to /mobile. */
export const desktopGuard: CanActivateFn = () => {
  const device = inject(DeviceService);
  const router = inject(Router);
  return device.isMobile() ? router.createUrlTree(['/mobile']) : true;
};
