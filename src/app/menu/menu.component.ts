import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { Planet } from '../services/planet-data.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink, TitleCasePipe],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  @Input() planets: Planet[] = [];
  isOpen = false;

  toggle(): void {
    this.isOpen = !this.isOpen;
  }

  close(): void {
    this.isOpen = false;
  }
}
