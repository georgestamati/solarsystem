import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/desktop-welcome/desktop-welcome.component').then(
        m => m.DesktopWelcomeComponent
      ),
  },
  {
    path: 'galaxy',
    loadComponent: () =>
      import('./features/galaxy/galaxy.component').then(m => m.GalaxyComponent),
  },
  {
    path: 'compare',
    loadComponent: () =>
      import('./features/planet-compare/planet-compare.component').then(
        m => m.PlanetCompareComponent
      ),
  },
  {
    path: ':planet',
    loadComponent: () =>
      import('./features/planet-detail/planet-detail.component').then(
        m => m.PlanetDetailComponent
      ),
  },
  { path: '**', redirectTo: '' },
];
