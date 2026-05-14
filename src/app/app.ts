import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SearchDialogComponent } from './shared/components/search-dialog/search-dialog.component';
import { KeyboardHelpComponent } from './shared/components/keyboard-help/keyboard-help.component';
import { KeyboardService } from './core/services/keyboard.service';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SearchDialogComponent, KeyboardHelpComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  // KeyboardService owns all global keydown handling
  private readonly _kb = inject(KeyboardService);
  // ThemeService initialises itself via effect() in constructor
  private readonly _theme = inject(ThemeService);
}
