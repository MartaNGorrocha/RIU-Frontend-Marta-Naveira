import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Hero, HeroListItem } from '../models/hero.model';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/heroes';

  getHeroes(): Observable<HeroListItem[]> {
    return this.http.get<HeroListItem[]>(this.apiUrl);
  }

  getHeroById(id: string): Observable<Hero> {
    return this.http.get<Hero>(`${this.apiUrl}/${id}`);
  }

  searchHeroes(term: string): Observable<HeroListItem[]> {
    return this.http.get<HeroListItem[]>(`${this.apiUrl}?alias_like=${term}`);
  }

  createHero(hero: Omit<Hero, 'id'>): Observable<Hero> {
    return this.http.post<Hero>(this.apiUrl, hero);
  }

  updateHero(hero: Hero): Observable<Hero> {
    return this.http.put<Hero>(`${this.apiUrl}/${hero.id}`, hero);
  }

  deleteHero(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
