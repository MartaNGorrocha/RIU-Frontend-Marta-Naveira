import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { DeleteHeroDialogComponent } from './delete-hero-dialog.component';

describe('DeleteHeroDialogComponent', () => {
 let component: DeleteHeroDialogComponent;
  let fixture: ComponentFixture<DeleteHeroDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteHeroDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { alias: 'Spiderman' } },
        { provide: MatDialogRef, useValue: jasmine.createSpyObj('MatDialogRef', ['close']) }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteHeroDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
