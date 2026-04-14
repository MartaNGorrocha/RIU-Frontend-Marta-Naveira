import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Hero } from '../models/hero.model';
import { HeroesService } from '../services/heroes.service';

export const heroResolver: ResolveFn<Hero> = (route) => {
  const heroesService = inject(HeroesService);
  const id = route.paramMap.get('id');

  return heroesService.getHeroById(id!);
};
