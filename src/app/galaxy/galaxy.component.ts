import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { PlanetDataService, Planet } from '../services/planet-data.service';
import { VoiceService } from '../services/voice.service';
import { SessionService } from '../services/session.service';
import { FullscreenService } from '../services/fullscreen.service';
import { AudioService } from '../services/audio.service';
import { ThemeService } from '../services/theme.service';
import { MenuComponent } from '../menu/menu.component';
import { ParallaxDirective } from '../directives/parallax.directive';

export type SpeedMode = 'real' | 'uniform' | 'custom';

// Base durations (seconds) — must match SCSS $*OrbitalRotation variables.
const BASE_DURATIONS: Record<string, number> = {
  sun:       0,
  mercury:   2.408,
  venus:     6.152,
  earth:     10,
  moon:      1,
  mars:      18.8085,
  asteroids: 95,
  jupiter:   118.6,
  saturn:    294.6,
  uranus:    840.1,
  neptune:   1650,
};

// In "uniform" mode every planet takes this many seconds per orbit.
const UNIFORM_DURATION = 10;

@Component({
  selector: 'app-galaxy',
  standalone: true,
  imports: [MenuComponent, ParallaxDirective, FormsModule, RouterLink],
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
  readonly audio = inject(AudioService);
  readonly theme = inject(ThemeService);

  private readonly solarSystem$ = this.data.getAll();

  readonly planets = toSignal(this.solarSystem$.pipe(map(s => s.records)), {
    initialValue: [] as Plan