import { Routes } from '@angular/router';
import { desktopGuard } from './core/guards/desktop.guard';
import { mobileGuard } from './core/guards/mobile.guard';
import { DesktopWelcomeComponent } from './features/welcome/desktop-welcome/desktop-welcome.component';
import { MobileWelcomeComponent } from './features/welcome/mobile-welcome/mobile-welcome.component';
import { GalaxyComponent } from './features/galaxy/galaxy.component';
import { MobileControllerComponent } from './features/mobile-controller/mobile-controller.component';

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
