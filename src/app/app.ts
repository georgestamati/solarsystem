import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SearchDialogComponent } from './search-dialog/search-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SearchDialogComponent],
  template: `<div class="container"><router-outlet /><app-search-dialog /></div>`,
  styleUrl: './app.scss',
})
export class App {}
