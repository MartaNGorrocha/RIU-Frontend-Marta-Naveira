import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

interface DeleteHeroDialogData {
  alias: string;
}

@Component({
  selector: 'app-delete-hero-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './delete-hero-dialog.component.html',
  styleUrl: './delete-hero-dialog.component.css'
})
export class DeleteHeroDialogComponent {
  constructor(
    private readonly dialogRef: MatDialogRef<DeleteHeroDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteHeroDialogData
  ) {}

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
}
