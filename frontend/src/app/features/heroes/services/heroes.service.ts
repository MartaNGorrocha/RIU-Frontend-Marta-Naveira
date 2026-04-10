import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Hero } from '../models/hero.model';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/heroes';

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.apiUrl);
  }

  getHeroById(id: number): Observable<Hero> {
    return this.http.get<Hero>(`${this.apiUrl}/${id}`);
  }

  searchHeroes(term: string): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.apiUrl}?alias_like=${term}`);
  }

  createHero(hero: Omit<Hero, 'id'>): Observable<Hero> {
    return this.http.post<Hero>(this.apiUrl, hero);
  }

  updateHero(hero: Hero): Observable<Hero> {
    return this.http.put<Hero>(`${this.apiUrl}/${hero.id}`, hero);
  }

  deleteHero(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
