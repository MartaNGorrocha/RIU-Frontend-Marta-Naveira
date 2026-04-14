import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { HeroesService } from '../../services/heroes.service';
import { HeroListItem } from '../../models/hero.model';
import { Router, RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { debounceTime, distinctUntilChanged } from 'rxjs';

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
    MatAutocompleteModule,
    RouterLink,
    MatPaginatorModule,
    MatPaginator,
    MatButtonModule],
  templateUrl: './heroes-list.component.html',
  styleUrl: './heroes-list.component.css'
})
export class HeroesListComponent implements OnInit, AfterViewInit {
  private readonly heroesService = inject(HeroesService);
  private readonly router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'alias',
    'universe',
    'powerLevel',
    'city',
    'active',
  ];

  heroes: HeroListItem[] = [];

  filterControl = new FormControl('', { nonNullable: true });

  dataSource = new MatTableDataSource<HeroListItem>([]);

  ngOnInit(): void {
    this.loadHeroes();
    this.dataSource.filterPredicate = (hero, filter) => {
      return hero.alias.toLowerCase().includes(filter);
    };

    this.filterControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.dataSource.filter = value.trim().toLowerCase();
        this.dataSource.paginator?.firstPage();
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadHeroes(): void {
    this.heroesService.getHeroes().subscribe(heroes => {
      this.heroes = heroes;
      this.dataSource.data = heroes;
      console.log('Heroes loaded:', this.dataSource);
    });
  }

  addHero(): void {
    this.router.navigate(['/heroes/new']);
  }

  goToEdit(hero: HeroListItem): void {
    this.router.navigate(['/heroes', hero.id, 'edit']);
  }

  deleteHero(hero: HeroListItem): void {
    console.log('delete', hero);
  }
}
