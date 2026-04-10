import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/heroes/pages/heroes-list/heroes-list.component')
        .then(c => c.HeroesListComponent)
  }
];
