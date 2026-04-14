import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { HeroesService } from '../../services/heroes.service';
import { Hero } from '../../models/hero.model';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
	selector: 'app-heroes-list',
	standalone: true,
	imports: [CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatChipsModule,
    MatCardModule,
  MatAutocompleteModule],
	templateUrl: './heroes-list.component.html',
	styleUrl: './heroes-list.component.css'
})
export class HeroesListComponent implements OnInit {
	private readonly heroesService = inject(HeroesService);
	private readonly router = inject(Router);

	@ViewChild(MatPaginatorModule) paginator!: MatPaginatorModule;

	displayedColumns: string[] = [
		'alias',
		'universe',
		'powerLevel',
		'city',
		'active',
	];

	heroes: Hero[] = [];

  filterControl = new FormControl<string | Hero>('');

  dataSource = new MatTableDataSource<Hero>([]);

	ngOnInit(): void {
		this.loadHeroes();


	}
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

	loadHeroes(): void {
		this.heroesService.getHeroes().subscribe(heroes => {
			this.heroes = heroes;
			this.dataSource.data = heroes;
      console.log('Heroes loaded:', this.dataSource);
		});
	}

	goToCreate(): void {
		this.router.navigate(['/heroes/new']);
	}

	goToEdit(hero: Hero): void {
		this.router.navigate(['/heroes', hero.id, 'edit']);
	}

	deleteHero(hero: Hero): void {
		console.log('delete', hero);
	}
}
