import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { Hero, HeroUniverse } from '../../models/hero.model';
import { HeroesService } from '../../services/heroes.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UppercaseDirective } from '../../../../shared/directives/uppercase.directive';
import { map } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { filter, switchMap } from 'rxjs';
import { DeleteHeroDialogComponent } from '../../components/delete-hero-dialog/delete-hero-dialog.component';

type HeroFormMode = 'create' | 'edit' | 'detail';

@Component({
  selector: 'app-hero-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    UppercaseDirective
  ],
  templateUrl: './hero-form.component.html',
  styleUrl: './hero-form.component.css'
})

export class HeroFormComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly heroesService = inject(HeroesService);
  private readonly fb = inject(FormBuilder);

  readonly universes: HeroUniverse[] = ['Marvel', 'DC'];

  mode: HeroFormMode = 'create';

  hero?: Hero;
  readonly hero$ = this.route.data.pipe(
    map(data => data['hero'] as Hero)
  );

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(60)]],
    alias: ['', [Validators.required, Validators.maxLength(60)]],
    universe: ['', Validators.required],
    powerLevel: [50, [Validators.required, Validators.min(1), Validators.max(100)]],
    city: ['', [Validators.required, Validators.maxLength(60)]],
    active: [true],
    superPower: ['', [Validators.required, Validators.maxLength(120)]],
    description: ['', [Validators.required, Validators.maxLength(500)]]
  });

  private readonly dialog = inject(MatDialog);

  ngOnInit(): void {

    this.mode = (this.route.snapshot.data['mode'] as HeroFormMode) ?? 'create';

    if (this.isCreateMode) return;

    this.hero$.subscribe(hero => {
      this.hero = hero;
      this.patchForm(hero);

      if (this.isDetailMode) {
        this.form.disable();
      }
    });

  }

  get pageTitle(): string {
    if (this.isCreateMode) return 'Nuevo héroe';
    if (this.isEditMode) return 'Editar héroe';
    return this.hero?.alias ?? 'Detalle del héroe';
  }

  get pageSubtitle(): string {
    if (this.isCreateMode) return 'Completa los datos para dar de alta un nuevo héroe.';
    if (this.isEditMode) return 'Modifica la información del héroe seleccionado.';
    return this.hero?.name ?? '';
  }

  get isCreateMode(): boolean {
    return this.mode === 'create';
  }

  get isEditMode(): boolean {
    return this.mode === 'edit';
  }

  get isDetailMode(): boolean {
    return this.mode === 'detail';
  }

  goBack(): void {
    this.router.navigate(['/heroes']);
  }

  onSubmit(): void {
    if (this.form.invalid || this.isDetailMode) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();

    if (this.isCreateMode) {
      this.heroesService.createHero(formValue).subscribe((createdHero) => {
        this.router.navigate(['/heroes']);
      });
      return;
    }

    if (!this.hero) return;

    const updatedHero: Hero = {
      ...this.hero,
      ...formValue
    };

    this.heroesService.updateHero(updatedHero).subscribe((savedHero) => {
      this.router.navigate(['/heroes']);
    });
  }

  editHero(): void {
    if (!this.hero) return;
    this.router.navigate(['/heroes', this.hero.id, 'edit']);
  }

  deleteHero(): void {
    if (!this.hero) return;

    this.dialog
      .open(DeleteHeroDialogComponent, {
        data: { alias: this.hero.alias }
      })
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(() => this.heroesService.deleteHero(this.hero!.id))
      )
      .subscribe(() => {
        this.router.navigate(['/heroes']);
      });
  }

  private patchForm(hero: Hero): void {
    this.form.patchValue({
      name: hero.name,
      alias: hero.alias,
      universe: hero.universe,
      powerLevel: hero.powerLevel,
      city: hero.city,
      active: hero.active,
      superPower: hero.superPower,
      description: hero.description
    });
  }
}
