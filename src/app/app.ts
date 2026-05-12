import { Component, HostListener, inject } from '@angular/core';
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
  private readonly kb = inject(KeyboardService);
  // ThemeService initialises itself via effect() in constructor
  private readonly _theme = inject(ThemeService);

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    const tag = (e.target as HTMLElement).tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    if (e.key === 'ArrowLeft')  this.kb.navigatePrev();
    if (e.key === 'ArrowRight') this.kb.navigateNext();
    if (e.key === 'f' || e.key === 'F') {
      // Fullscreen is handled per-component; nothing here globally
    }
  }
}
