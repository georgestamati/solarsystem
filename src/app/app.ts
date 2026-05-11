import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<div class="container"><router-outlet /></div>',
  styleUrl: './app.scss',
})
export class App {}
