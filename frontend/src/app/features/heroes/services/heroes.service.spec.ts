/// <reference types="jasmine" />

import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController
} from '@angular/common/http/testing';

import { HeroesService } from './heroes.service';
import { Hero } from '../models/hero.model';

describe('HeroesService', () => {
  let service: HeroesService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:3000/heroes';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HeroesService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(HeroesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all heroes', () => {
    const mockHeroes = [
      {
        id: '1',
        name: 'Peter Parker',
        alias: 'Spiderman',
        universe: 'Marvel',
        powerLevel: 92,
        city: 'Nueva York',
        active: true
      }
    ];

    service.getHeroes().subscribe((heroes) => {
      expect(heroes.length).toBe(1);
      expect(heroes[0].alias).toBe('Spiderman');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockHeroes);
  });

  it('should create a new hero', () => {
    const newHero = {
      name: 'Barry Allen',
      alias: 'Flash',
      universe: 'DC' as const,
      powerLevel: 90,
      city: 'Central City',
      active: true,
      superPower: 'Super velocidad',
      description: 'El hombre más rápido del mundo'
    };

    const createdHero = {
      id: '16',
      ...newHero
    };

    service.createHero(newHero).subscribe((hero) => {
      expect(hero.id).toBe('16');
      expect(hero.alias).toBe('Flash');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newHero);
    req.flush(createdHero);
  });

  it('should update an existing hero', () => {
    const updatedHero: Hero = {
      id: '1',
      name: 'Peter Parker',
      alias: 'Spiderman',
      universe: 'Marvel',
      powerLevel: 92,
      city: 'Madrid',
      active: true,
      superPower: 'Sentido arácnido',
      description: 'Descripción'
    };

    service.updateHero(updatedHero).subscribe((hero) => {
      expect(hero.city).toBe('Madrid');
      expect(hero.id).toBe('1');
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedHero);
    req.flush(updatedHero);
  });

  it('should delete a hero', () => {
    service.deleteHero('1').subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
