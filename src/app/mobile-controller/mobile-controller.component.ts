import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PlanetDataService, Planet, Moon } from '../services/planet-data.service';
import { SocketService } from '../services/socket.service';
import { SessionService } from '../services/session.service';
import { TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mobile-controller',
  standalone: true,
  imports: [TitleCasePipe, FormsModule],
  templateUrl: './mobile-controller.component.html',
  styleUrl: './mobile-controller.component.scss'
})
export class MobileControllerComponent implements OnInit, OnDestroy {
  planets: Planet[] = [];
  expandedPlanet: string | null = null;
  private subs = new Subscription();

  constructor(
    private data: PlanetDataService,
    private socket: SocketService,
    private session: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.session.checkWelcomeCookie();
    this.data.getAll().subscribe(sys => {
      this.planets = sys.records;
    });

    // Desktop navigated — keep mobile in sync
    this.subs.add(
      this.socket.on<{ url: string }>('urlcontrol').subscribe(data => {
        this.router.navigateByUrl(data.url);
      })
    );
  }

  navigateTo(url: string): void {
    this.socket.emit('eventchange', { url });
  }

  toggleMoons(name: string): void {
    this.expandedPlanet = this.expandedPlanet === name ? null : name;
  }

  showMoonTooltip(moon: Moon, click: boolean): void {
    this.socket.emit('showTooltipFromMobile', { id: moon.name, click });
  }

  sendInfo(value: string): void {
    this.socket.emit('showMobileInfo', { value });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
