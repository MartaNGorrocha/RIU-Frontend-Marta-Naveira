import { Routes } from '@angular/router';
import { heroResolver } from './features/heroes/resolvers/hero.resolver';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'heroes',
    pathMatch: 'full'
  },
  {
    path: 'heroes',
    loadComponent: () =>
      import('./features/heroes/pages/heroes-list/heroes-list.component').then(
        (c) => c.HeroesListComponent
      )
  },
  {
    path: 'heroes/new',
    loadComponent: () =>
      import('./features/heroes/pages/hero-form/hero-form.component').then(
        (c) => c.HeroFormComponent
      ),
    data: { mode: 'create' }
  },
  {
    path: 'heroes/:id',
    loadComponent: () =>
      import('./features/heroes/pages/hero-form/hero-form.component').then(
        (c) => c.HeroFormComponent
      ),
    resolve: { hero: heroResolver },
    data: { mode: 'detail' }
  },
  {
    path: 'heroes/:id/edit',
    loadComponent: () =>
      import('./features/heroes/pages/hero-form/hero-form.component').then(
        (c) => c.HeroFormComponent
      ),
    resolve: { hero: heroResolver },
    data: { mode: 'edit' }
  }
];
