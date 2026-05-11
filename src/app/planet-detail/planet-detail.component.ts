import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
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
  private readonly modalDialog = viewChild<ElementRef<HTMLElement>>('modalDialog');
  private readonly closeButton = viewChild<ElementRef<HTMLButtonElement>>('closeButton');

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

  ngOnDestroy(): void {
    this.voice.stop();
    speechSynthesis.cancel();
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
    queueMicrotask(() => this.closeButton()?.nativeElement.focus());
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

  onModalKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeModal();
      return;
    }

    if (event.key !== 'Tab') return;

    const modal = this.modalDialog()?.nativeElement;
    if (!modal) return;

    const focusable = Array.from(
      modal.querySelectorAll<HTMLElement>('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])')
    ).filter((element) => !element.hasAttribute('hidden'));

    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = modal.ownerDocument.activeElement as HTMLElement | null;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  /**
   * Returns the background-image URL for a moon.
   * When the host planet is 'sun', its "moons" are actually the orbiting
   * planets — use the planet image instead of a (non-existent) moon image.
   */
  moonImageUrl(planetName: string, moonName: string): string {
    if (planetName === 'sun') {
      return `url(img/planets/${moonName}.jpg)`;
    }
    return `url(img/moons/${planetName}/${moonName}.jpg)`;
  }

  readActiveText(): void {
    const tab = this.activeTab();
    const p = this.planet();
    if (!p || !tab || tab === 'profile') return;
    const tabKey = tab === 'intro' ? 'introduction' : tab;
    const content = p.contents?.[tabKey as 'introduction' | 'description']?.content ?? [];
    speechSynthesis.speak(new SpeechSynthesisUtterance(content.join(' ')));
  }
}
