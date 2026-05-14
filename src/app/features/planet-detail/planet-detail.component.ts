import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  linkedSignal,
  signal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TitleCasePipe, KeyValuePipe } from '@angular/common';
import { PlanetDataService, Planet, Moon } from '../../core/services/planet-data.service';
import { VoiceService } from '../../core/services/voice.service';
import { MenuComponent } from '../../shared/components/menu/menu.component';
import { FactsCarouselComponent } from '../../shared/components/facts-carousel/facts-carousel.component';
import { SizeComparisonComponent } from '../../shared/components/size-comparison/size-comparison.component';

type SidebarTab = 'profile' | 'intro' | 'description' | null;

@Component({
  selector: 'app-planet-detail',
  standalone: true,
  imports: [MenuComponent, TitleCasePipe, KeyValuePipe, FactsCarouselComponent, SizeComparisonComponent],
  templateUrl: './planet-detail.component.html',
  styleUrl: './planet-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanetDetailComponent {
  private readonly router = inject(Router);
  private readonly data   = inject(PlanetDataService);
  private readonly voice  = inject(VoiceService);

  private readonly closeButton = viewChild<ElementRef<HTMLButtonElement>>('closeButton');

  /**
   * Route param `:planet` injected directly as a signal input via
   * withComponentInputBinding() — no ActivatedRoute or toSignal() needed.
   */
  readonly planet_param = input<string>('', { alias: 'planet' });

  /** All planets from the resource — used for prev/next navigation. */
  readonly allPlanets = this.data.planets;

  /** The resolved Planet object — null while loading or if name not found. */
  readonly planet = computed<Planet | null>(() => {
    const name = this.planet_param();
    if (!name) return null;
    const found = this.data.getPlanet(name) ?? null;
    if (!found && this.data.planets().length > 0) {
      // Data is loaded but planet not found — redirect
      this.router.navigateByUrl('/galaxy');
    }
    return found;
  });

  /**
   * Active sidebar tab — automatically resets to null whenever the planet
   * changes, using linkedSignal's computed source pattern.
   */
  readonly activeTab = linkedSignal<Planet | null, SidebarTab>({
    source: this.planet,
    computation: () => null,
  });

  readonly hoveredMoon   = signal<Moon | null>(null);
  readonly galleryImages = signal<string[]>([]);
  readonly modalOpen     = signal(false);
  readonly modalIndex    = signal(0);

  readonly tabs: SidebarTab[] = ['profile', 'intro', 'description'];

  readonly descriptionEntries = computed(() => {
    const desc = this.planet()?.description;
    if (!desc) return [];
    return Object.entries(desc).map(([key, value]) => ({ key, value }));
  });

  constructor() {
    const destroyRef = inject(DestroyRef);

    // Start voice recognition; stop + cancel speech on destroy
    this.voice.start();
    destroyRef.onDestroy(() => { this.voice.stop(); speechSynthesis.cancel(); });

    // Voice command handling — auto-cleaned up via takeUntilDestroyed
    this.voice.commands$.pipe(takeUntilDestroyed()).subscribe(cmd => {
      if (cmd.type === 'sidebar' && cmd.payload) this.toggleTab(cmd.payload as SidebarTab);
      if (cmd.type === 'gallery')                this.openGallery();
      if (cmd.type === 'home')                   this.router.navigateByUrl('/galaxy');
      if (cmd.type === 'navigate' && cmd.payload) this.router.navigateByUrl('/' + cmd.payload);
    });
  }

  toggleTab(tab: SidebarTab): void {
    this.activeTab.update(current => (current === tab ? null : tab));
  }

  hoverMoon(moon: Moon | null): void { this.hoveredMoon.set(moon); }

  moonImageUrl(planetName: string, moonName: string): string {
    // Only earth's moon has a dedicated image; others use the planet texture as fallback
    if (moonName === 'moon') return `url(assets/img/moon.jpg)`;
    return `url(assets/img/${planetName}.jpg)`;
  }

  openGallery(): void {
    const p = this.planet();
    if (!p) return;
    this.galleryImages.set([`assets/img/${p.name}.jpg`]);
    this.modalOpen.set(true);
    setTimeout(() => this.closeButton()?.nativeElement.focus(), 50);
  }

  closeModal(): void { this.modalOpen.set(false); }

  prevSlide(): void {
    const len = this.galleryImages().length;
    this.modalIndex.update(i => (i - 1 + len) % len);
  }

  nextSlide(): void {
    const len = this.galleryImages().length;
    this.modalIndex.update(i => (i + 1) % len);
  }

  onModalKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape')     this.closeModal();
    if (event.key === 'ArrowLeft')  this.prevSlide();
    if (event.key === 'ArrowRight') thi