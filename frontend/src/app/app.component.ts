import { Component } from '@angular/core';
import { ShellComponent } from "./core/layout/shell/shell.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ShellComponent],
  templateUrl: './app.component.html',
  template: `<app-shell />`,
})
export class AppComponent {
  title = 'frontend';
}
