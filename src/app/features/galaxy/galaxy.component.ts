import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PlanetDataService, Planet } from '../../core/services/planet-data.service';
import { VoiceService } from '../../core/services/voice.service';
import { SessionService } from '../../core/services/session.service';
import { FullscreenService } from '../../core/services/fullscreen.service';
import { AudioService } from '../../core/services/audio.service';
import { ThemeService } from '../../core/services/theme.service';
import { MenuComponent } from '../../shared/components/menu/menu.component';
import { ParallaxDirective } from '../../shared/directives/parallax.directive';

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
export class GalaxyComponent {
  private readonly data    = inject(PlanetDataService);
  private readonly voice   = inject(VoiceService);
  private readonly session = inject(SessionService);
  private readonly router  = inject(Router);
  readonly fullscreen      = inject(FullscreenService);
  readonly audio           = inject(AudioService);
  readonly theme           = inject(ThemeService);

  /** Direct signal from httpResource — no Observable bridge needed. */
  readonly planets = this.data.planets;

  /** Planets excluding the Sun (sun is rendered separately as the static centre). */
  readonly orbitPlanets = computed(() =>
    this.planets().filter(p => p.name !== 'sun')
  );

  readonly speedMode   = signal<SpeedMode>('real');
  readonly customSpeed = signal(1);

  private readonly galaxyRef = viewChild<ElementRef<HTMLElement>>('galaxyRef');

  constructor() {
    // Mark intro as seen — replaces ngOnInit
    this.session.markIntroSeen();

    // Apply CSS custom property durations whenever speed or mode changes
    effect(() => {
      const mode  = this.speedMode();
      const speed = this.customSpeed();
      const el    = this.galaxyRef()?.nativeElement ?? document.documentElement;

      for (const [name, base] of Object.entries(BASE_DURATIONS)) {
        let duration: number;
        if (name === 'sun') {
          duration = 0;
        } else if (mode === 'uniform') {
          duration = UNIFORM_DURATION;
        } else if (mode === 'custom') {
          duration = base / speed;
        } else {
          duration = base; // 'real'
        }
        el.style.setProperty(`--${name}-duration`, `${duration}s`);
      }

      // Global divisor for SCSS calc()
      el.style.setProperty('--orbit-speed', mode === 'custom' ? String(speed) : '1');
    });

    // Voice commands for the galaxy view — auto-cleaned up via takeUntilDestroyed
    this.voice.commands$.pipe(takeUntilDestroyed()).subscribe(cmd => {
      if (cmd.type === 'navigate' && cmd.payload) {
        this.router.navigateByUrl('/' + cmd.payload);
      }
    });
  }

  navigate(planet: string): void {
    this.audio.playClick();
    this.router.navigateByUrl('/' + planet);
  }

  setSpeedMode(mode: SpeedMode): void {
    this.speedMode.set(mode);
  }

  onCustomSpeedChange(event: Event): void {
    const val = parseFloat((event.target as HTMLInputElement).value);
    if (!isNaN(val) && val > 0) {
      this.customSpeed.set(val);
    }
  }
}
