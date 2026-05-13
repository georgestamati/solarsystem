import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SearchDialogComponent } from './search-dialog/search-dialog.component';
import { KeyboardHelpComponent } from './keyboard-help/keyboard-help.component';
import { KeyboardService } from './services/keyboard.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SearchDialogComponent, KeyboardHelpComponent],
  template: `<div class="container">
    <router-outlet />
    <app-search-dialog />
    <app-keyboard-help />
  </div>`,
  styleUrl: './app.scss',
})
export class App {
  // KeyboardService bootstraps its global listener in constructor (singleton)
  private readonly _kb = inject(KeyboardService);
  // ThemeService applies data-theme attribute via effect() in constructor
  private readonly _theme = inject(ThemeService);
}
