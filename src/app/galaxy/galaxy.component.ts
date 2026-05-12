import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { PlanetDataService, Planet } from '../services/planet-data.service';
import { VoiceService } from '../services/voice.service';
import { SessionService } from '../services/session.service';
import { FullscreenService } from '../services/fullscreen.service';
import { MenuComponent } from '../menu/menu.component';
import { ParallaxDirective } from '../directives/parallax.directive';

@Component({
  selector: 'app-galaxy',
  standalone: true,
  imports: [MenuComponent, ParallaxDirective],
  templateUrl: './galaxy.component.html',
  styleUrl: './galaxy.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalaxyComponent implements OnInit, OnDestroy {
  private readonly data = inject(PlanetDataService);
  private readonly voice = inject(VoiceService);
  private readonly session = inject(SessionService);
  private readonly router = inject(Router);
  readonly fullscreen = inject(FullscreenService);

  private readonly solarSystem$ = this.data.getAll();

  readonly planets = toSignal(this.solarSystem$.pipe(map(s => s.records)), {
    initialValue: [] as Planet[],
  });

  readonly orbitPlanets = toSignal(
    this.solarSystem$.pipe(map(s => s.records.filter(p => p.name !== 'sun'))),
    { initialValue: [] as Planet[] }
  );

  constructor() {
    this.voice.commands$.pipe(takeUntilDestroyed()).subscribe(cmd => {
      if (cmd.type === 'navigate' && cmd.payload) {
        this.router.navigateByUrl('/' + cmd.payload);
      }
    });
  }

  ngOnInit(): void {
    this.session.checkWelcomeCookie();
    this.voice.start();
  }

  navigate(name: string): void {
    this.router.navigateByUrl('/' + name);
  }

  ngOnDestroy(): void {
    this.voice.stop();
  }
}
