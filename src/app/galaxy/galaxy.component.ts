import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PlanetDataService, Planet } from '../services/planet-data.service';
import { SocketService } from '../services/socket.service';
import { SessionService } from '../services/session.service';
import { VoiceService } from '../services/voice.service';
import { MenuComponent } from '../menu/menu.component';
import { ParallaxDirective } from '../directives/parallax.directive';
@Component({
  selector: 'app-galaxy',
  standalone: true,
  imports: [MenuComponent, ParallaxDirective],
  templateUrl: './galaxy.component.html',
  styleUrl: './galaxy.component.scss'
})
export class GalaxyComponent implements OnInit, OnDestroy {
  planets: Planet[] = [];
  // planets without sun (for the orbit loop)
  orbitPlanets: Planet[] = [];
  private subs = new Subscription();

  constructor(
    private data: PlanetDataService,
    private socket: SocketService,
    private session: SessionService,
    private voice: VoiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.session.checkWelcomeCookie();

    this.data.getAll().subscribe(sys => {
      this.planets = sys.records;
      // exclude sun — it's hardcoded in the template at centre
      this.orbitPlanets = sys.records.filter(p => p.name !== 'sun');
    });

    // Mobile remote navigation
    this.subs.add(
      this.socket.on<{ url: string }>('urlcontrol').subscribe(data => {
        this.router.navigateByUrl(data.url);
      })
    );

    // Voice — desktop only
    this.voice.start();
    this.subs.add(
      this.voice.commands$.subscribe(cmd => {
        if (cmd.type === 'navigate' && cmd.payload) {
          this.router.navigateByUrl('/' + cmd.payload);
        }
      })
    );
  }

  navigate(name: string): void {
    this.router.navigateByUrl('/' + name);
  }

  ngOnDestroy(): void {
    this.voice.stop();
    this.subs.unsubscribe();
  }
}
