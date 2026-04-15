import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AfterViewInit, Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
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
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs';
import { DeleteHeroDialogComponent } from '../../components/delete-hero-dialog/delete-hero-dialog.component';

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
    MatCardModule,
    RouterLink],
  templateUrl: './heroes-list.component.html',
  styleUrl: './heroes-list.component.css'
})
export class HeroesListComponent implements OnInit, AfterViewInit {
  private readonly heroesService = inject(HeroesService);
  private readonly router = inject(Router);

  private readonly destroyRef = inject(DestroyRef);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private readonly dialog = inject(MatDialog);

  displayedColumns: string[] = [
    'alias',
    'universe',
    'powerLevel',
    'city',
    'active',
    'actions'
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
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
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
    });
  }

  addHero(): void {
    this.router.navigate(['/heroes/new']);
  }

  editHero(hero: HeroListItem): void {
    this.router.navigate(['/heroes', hero.id, 'edit']);
  }

  deleteHero(hero: HeroListItem): void {
    this.dialog
      .open(DeleteHeroDialogComponent, {
        data: { alias: hero.alias }
      })
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(() => this.heroesService.deleteHero(hero.id))
      )
      .subscribe(() => {
        this.loadHeroes();
      });
  }



}
