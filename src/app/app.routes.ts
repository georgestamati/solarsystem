import { Routes } from '@angular/router';
import { desktopGuard } from './guards/desktop.guard';
import { mobileGuard } from './guards/mobile.guard';
import { DesktopWelcomeComponent } from './desktop-welcome/desktop-welcome.component';
import { MobileWelcomeComponent } from './mobile-welcome/mobile-welcome.component';
import { GalaxyComponent } from './galaxy/galaxy.component';
import { MobileControllerComponent } from './mobile-controller/mobile-controller.component';

export const routes: Routes = [
  {
    path: '',
    component: DesktopWelcomeComponent,
    canActivate: [desktopGuard]
  },
  {
    path: 'mobile',
    component: MobileWelcomeComponent,
    canActivate: [mobileGuard]
  },
  {
    path: 'galaxy',
    component: GalaxyComponent,
    canActivate: [desktopGuard]
  },
  {
    path: 'mobile/galaxy',
    component: MobileControllerComponent,
    canActivate: [mobileGuard]
  },
  // Wildcard — will be replaced with PlanetDetailComponent in Phase 3
  { path: '**', redirectTo: '' }
];
