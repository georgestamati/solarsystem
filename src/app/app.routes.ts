import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./desktop-welcome/desktop-welcome.component').then(
        m => m.DesktopWelcomeComponent
      ),
  },
  {
    path: 'galaxy',
    loadComponent: () =>
      import('./galaxy/galaxy.component').then(m => m.GalaxyComponent),
  },
  {
    path: 'compare',
    loadComponent: () =>
      import('./planet-compare/planet-compare.component').then(
        m => m.PlanetCompareComponent
      ),
  },
  {
    path: ':planet',
    loadComponent: () =>
      import('./planet-detail/planet-detail.component').then(
        m => m.PlanetDetailComponent
      ),
  },
  { path: '**', redirectTo: '' },
];
