import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';

import { HeroFormComponent } from './hero-form.component';
import { HeroesService } from '../../services/heroes.service';
import { Hero } from '../../models/hero.model';

describe('HeroFormComponent', () => {
  let component: HeroFormComponent;
  let fixture: ComponentFixture<HeroFormComponent>;
  let heroesServiceSpy: jasmine.SpyObj<HeroesService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  const mockHero: Hero = {
    id: '1',
    name: 'Peter Parker',
    alias: 'Spiderman',
    universe: 'Marvel',
    powerLevel: 92,
    city: 'Nueva York',
    active: true,
    superPower: 'Sentido arácnido',
    description: 'Amigo y vecino de todos'
  };

  const createComponent = async (mode: 'create' | 'edit' | 'detail', hero: Hero | undefined = mockHero) => {
    TestBed.resetTestingModule();
    heroesServiceSpy = jasmine.createSpyObj('HeroesService', ['createHero', 'updateHero', 'deleteHero']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    heroesServiceSpy.createHero.and.returnValue(of(mockHero));
    heroesServiceSpy.updateHero.and.returnValue(of(mockHero));
    heroesServiceSpy.deleteHero.and.returnValue(of(void 0));

    dialogSpy.open.and.returnValue({
      afterClosed: () => of(false)
    } as any);

    await TestBed.configureTestingModule({
      imports: [HeroFormComponent, NoopAnimationsModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: { mode }
            },
            data: of(hero ? { hero } : {})
          }
        },
        { provide: Router, useValue: routerSpy },
        { provide: HeroesService, useValue: heroesServiceSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await createComponent('create', undefined);
  });

  it('should initialize in create mode', () => {
    expect(component).toBeTruthy();
    expect(component.mode).toBe('create');
    expect(component.pageTitle).toBe('Nuevo héroe');
    expect(component.pageSubtitle).toContain('Completa los datos');
  });

  it('should mark form as touched and not submit when form is invalid', () => {
    component.form.patchValue({
      name: '',
      alias: '',
      universe: '',
      city: '',
      superPower: '',
      description: ''
    });

    component.onSubmit();

    expect(heroesServiceSpy.createHero).not.toHaveBeenCalled();
    expect(component.form.touched).toBeTrue();
  });

  it('should create hero and navigate to list', () => {
    component.form.patchValue({
      name: 'Clark Kent',
      alias: 'Superman',
      universe: 'DC',
      powerLevel: 99,
      city: 'Metrópolis',
      active: true,
      superPower: 'Super fuerza',
      description: 'El hombre de acero'
    });

    component.onSubmit();

    expect(heroesServiceSpy.createHero).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/heroes']);
  });

  it('should navigate back to heroes list', () => {
    component.goBack();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/heroes']);
  });

  it('should not navigate to edit mode when hero is missing', () => {
    component.hero = undefined;
    component.editHero();
    expect(routerSpy.navigate).not.toHaveBeenCalledWith(['/heroes', jasmine.any(String), 'edit']);
  });

  it('should initialize in edit mode, patch form and submit update', async () => {
    await createComponent('edit', mockHero);

    expect(component.mode).toBe('edit');
    expect(component.pageTitle).toBe('Editar héroe');
    expect(component.form.get('alias')?.value).toBe('Spiderman');

    component.form.patchValue({
      city: 'Madrid'
    });
    component.onSubmit();

    expect(heroesServiceSpy.updateHero).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/heroes']);
  });

  it('should return in submit when hero is missing in edit mode', async () => {
    await createComponent('edit', mockHero);

    component.hero = undefined;
    component.form.patchValue({
      name: 'Clark Kent',
      alias: 'Superman',
      universe: 'DC',
      powerLevel: 99,
      city: 'Metrópolis',
      active: true,
      superPower: 'Super fuerza',
      description: 'El hombre de acero'
    });

    component.onSubmit();
    expect(heroesServiceSpy.updateHero).not.toHaveBeenCalled();
  });

  it('should disable form in detail mode and block submit', async () => {
    await createComponent('detail', mockHero);

    expect(component.isDetailMode).toBeTrue();
    expect(component.form.disabled).toBeTrue();
    expect(component.pageSubtitle).toBe(mockHero.name);

    component.onSubmit();

    expect(heroesServiceSpy.createHero).not.toHaveBeenCalled();
    expect(heroesServiceSpy.updateHero).not.toHaveBeenCalled();
  });

  it('should navigate to edit screen from detail mode', async () => {
    await createComponent('detail', mockHero);

    component.editHero();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/heroes', mockHero.id, 'edit']);
  });

  it('should not delete hero when dialog closes as false', async () => {
    await createComponent('detail', mockHero);

    component.deleteHero();

    expect(dialogSpy.open).toHaveBeenCalled();
    expect(heroesServiceSpy.deleteHero).not.toHaveBeenCalled();
  });

  it('should delete hero and navigate when dialog is confirmed', async () => {
    await createComponent('detail', mockHero);
    dialogSpy.open.and.returnValue({
      afterClosed: () => of(true)
    } as any);

    component.deleteHero();

    expect(heroesServiceSpy.deleteHero).toHaveBeenCalledWith(mockHero.id);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/heroes']);
  });

  it('should not attempt to delete when there is no hero loaded', async () => {
    await createComponent('detail', mockHero);
    component.hero = undefined;

    component.deleteHero();

    expect(dialogSpy.open).not.toHaveBeenCalled();
    expect(heroesServiceSpy.deleteHero).not.toHaveBeenCalled();
  });
});
