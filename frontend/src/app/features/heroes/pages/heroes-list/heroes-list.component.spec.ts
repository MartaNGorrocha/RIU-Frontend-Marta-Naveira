import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { Router } from '@angular/router';

import { HeroesListComponent } from './heroes-list.component';
import { HeroesService } from '../../services/heroes.service';
import { MatDialog } from '@angular/material/dialog';

describe('HeroesListComponent', () => {
  let component: HeroesListComponent;
  let fixture: ComponentFixture<HeroesListComponent>;
  let heroesServiceSpy: jasmine.SpyObj<HeroesService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  const mockHeroes = [
    {
      id: '1',
      name: 'Peter Parker',
      alias: 'Spiderman',
      universe: 'Marvel' as const,
      powerLevel: 92,
      city: 'Nueva York',
      active: true
    },
    {
      id: '2',
      name: 'Bruce Wayne',
      alias: 'Batman',
      universe: 'DC' as const,
      powerLevel: 88,
      city: 'Gotham',
      active: true
    }
  ];

  beforeEach(async () => {
    heroesServiceSpy = jasmine.createSpyObj('HeroesService', ['getHeroes', 'deleteHero']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    heroesServiceSpy.getHeroes.and.returnValue(of(mockHeroes));
    heroesServiceSpy.deleteHero.and.returnValue(of(void 0));

    dialogSpy.open.and.returnValue({
      afterClosed: () => of(false)
    } as any);

    await TestBed.configureTestingModule({
      imports: [HeroesListComponent, NoopAnimationsModule],
      providers: [
        { provide: HeroesService, useValue: heroesServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    })
      .overrideComponent(HeroesListComponent, {
        set: {
          template: ''
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(HeroesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load heroes on init', () => {
    expect(heroesServiceSpy.getHeroes).toHaveBeenCalled();
    expect(component.dataSource.data.length).toBe(2);
  });

  it('should navigate to create page', () => {
    component.addHero();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/heroes/new']);
  });

  it('should navigate to edit page', () => {
    component.editHero(mockHeroes[0]);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/heroes', '1', 'edit']);
  });

  it('should filter heroes by alias', () => {
    component.dataSource.filterPredicate = (hero, filter) =>
      hero.alias.toLowerCase().includes(filter);

    component.dataSource.data = mockHeroes;
    component.dataSource.filter = 'spiderman';

    expect(component.dataSource.filteredData.length).toBe(1);
    expect(component.dataSource.filteredData[0].alias).toBe('Spiderman');
  });

  it('should open delete dialog', () => {
    component.deleteHero(mockHeroes[0]);
    expect(dialogSpy.open).toHaveBeenCalled();
  });
});
