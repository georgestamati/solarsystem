import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { TitleCasePipe, KeyValuePipe } from '@angular/common';
import { PlanetDataService, Planet, Moon } from '../services/planet-data.service';
import { VoiceService } from '../services/voice.service';
import { MenuComponent } from '../menu/menu.component';

type SidebarTab = 'profile' | 'intro' | 'description' | null;

@Component({
  selector: 'app-planet-detail',
  standalone: true,
  imports: [MenuComponent, TitleCasePipe, KeyValuePipe],
  templateUrl: './planet-detail.component.html',
  styleUrl: './planet-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanetDetailComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly data = inject(PlanetDataService);
  private readonly voice = inject(VoiceService);

  readonly planet = signal<Planet | null>(null);
  readonly allPlanets = signal<Planet[]>([]);
  readonly activeTab = signal<SidebarTab>(null);
  readonly hoveredMoon = signal<Moon | null>(null);
  readonly galleryImages = signal<string[]>([]);
  readonly modalOpen = signal(false);
  readonly modalIndex = signal(0);

  readonly tabs: SidebarTab[] = ['profile', 'intro', 'description'];

  readonly descriptionEntries = computed(() => {
    const desc = this.planet()?.description;
    if (!desc) return [];
    return Object.entries(desc).map(([key, value]) => ({ key, value }));
  });

  constructor() {
    this.route.paramMap
      .pipe(
        switchMap(() => this.data.getAll()),
        takeUntilDestroyed()
      )
      .subscribe(sys => {
        this.allPlanets.set(sys.records);
        const name = this.route.snapshot.paramMap.get('planet') ?? '';
        const found = sys.records.find(p => p.name === name) ?? null;
        if (!found) {
          this.router.navigateByUrl('/galaxy');
        } else {
          this.planet.set(found);
        }
      });

    this.voice.commands$.pipe(takeUntilDestroyed()).subscribe(cmd => {
      if (cmd.type === 'sidebar' && cmd.payload) this.toggleTab(cmd.payload as SidebarTab);
      if (cmd.type === 'gallery') this.openGallery();
      if (cmd.type === 'home') this.router.navigateByUrl('/galaxy');
      if (cmd.type === 'navigate' && cmd.payload) this.router.navigateByUrl('/' + cmd.payload);
    });
  }

  ngOnInit(): void {
    this.voice.start();
  }

  toggleTab(tab: SidebarTab): void {
    this.activeTab.update(current => (current === tab ? null : tab));
  }

  hoverMoon(moon: Moon | null): void {
    this.hoveredMoon.set(moon);
  }

  openGallery(): void {
    const name = this.planet()?.name;
    if (!name) return;
    this.galleryImages.set([`img/planets/${name}.jpg`, `img/planets/${name}_hd.jpg`]);
    this.modalOpen.set(true);
    this.modalIndex.set(0);
  }

  prevSlide(): void {
    this.modalIndex.update(
      i => (i - 1 + this.galleryImages().length) % this.galleryImages().length
    );
  }

  nextSlide(): void {
    this.modalIndex.update(i => (i + 1) % this.galleryImages().length);
  }

  closeModal(): void {
    this.modalOpen.set(false);
  }

  readActiveText(): void {
    const tab = this.activeTab();
    const p = this.planet();
    if (!p || !tab || tab === 'profile') return;
    const tabKey = tab === 'intro' ? 'introduction' : tab;
    const content = p.contents?.[tabKey as 'introduction' | 'description']?.content ?? [];
    speechSynthesis.speak(new SpeechSynthesisUtterance(content.join(' ')));
  }

  ngOnDestroy(): void {
    this.voice.stop();
    speechSynthesis.cancel();
  }
}
