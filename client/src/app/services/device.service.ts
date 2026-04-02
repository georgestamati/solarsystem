import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DeviceService {
  isMobile(): boolean {
    return /mobile/i.test(navigator.userAgent);
  }
}
