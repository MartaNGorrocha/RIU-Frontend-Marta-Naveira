import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { HeroFormComponent } from './hero-form.component';
import { HeroesService } from '../../services/heroes.service';

describe('HeroFormComponent', () => {
  let component: HeroFormComponent;
  let fixture: ComponentFixture<HeroFormComponent>;

  const heroesServiceSpy = jasmine.createSpyObj('HeroesService', [
    'createHero',
    'updateHero',
    'deleteHero'
  ]);

  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroFormComponent, NoopAnimationsModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: { mode: 'create' }
            },
            data: of({})
          }
        },
        { provide: Router, useValue: routerSpy },
        { provide: HeroesService, useValue: heroesServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
