import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { isObservable, of, firstValueFrom } from 'rxjs';

import { heroResolver } from './hero.resolver';
import { HeroesService } from '../services/heroes.service';
import { Hero } from '../models/hero.model';

describe('heroResolver', () => {
  let heroesServiceSpy: jasmine.SpyObj<HeroesService>;

  const mockHero: Hero = {
    id: '1',
    name: 'Peter Parker',
    alias: 'Spiderman',
    universe: 'Marvel',
    powerLevel: 92,
    city: 'Nueva York',
    active: true,
    superPower: 'Sentido arácnido, adherencia a superficies y gran agilidad',
    description: 'Héroe de barrio con habilidades arácnidas y un fuerte sentido de la responsabilidad.'
  };

  beforeEach(() => {
    heroesServiceSpy = jasmine.createSpyObj('HeroesService', ['getHeroById']);
    heroesServiceSpy.getHeroById.and.returnValue(of(mockHero));

    TestBed.configureTestingModule({
      providers: [{ provide: HeroesService, useValue: heroesServiceSpy }]
    });
  });

  it('should resolve a hero by id', async () => {
    const route = {
      paramMap: {
        get: (key: string) => (key === 'id' ? '1' : null)
      }
    } as unknown as ActivatedRouteSnapshot;

    const state = {} as RouterStateSnapshot;

    const result = TestBed.runInInjectionContext(() => heroResolver(route, state));

    const hero = isObservable(result)
      ? await firstValueFrom(result)
      : await Promise.resolve(result);

    expect(heroesServiceSpy.getHeroById).toHaveBeenCalledWith('1');
    expect(hero).toEqual(mockHero);
  });
});
