import { Component, inject, OnInit } from '@angular/core';
import { HeroesService } from '../../services/heroes.service';
import { Hero } from '../../models/hero.model';

@Component({
  selector: 'app-heroes-list',
  standalone: true,
  imports: [],
  templateUrl: './heroes-list.component.html',
  styleUrl: './heroes-list.component.css'
})
export class HeroesListComponent implements OnInit {
  private readonly heroesService = inject(HeroesService);

  heroes: Hero[] = [];

  ngOnInit(): void {
    this.heroesService.getHeroes().subscribe({
      next: heroes => {
        this.heroes = heroes;
        console.log('heroes', heroes);
      }
    });
  }
}
