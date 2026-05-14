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
export class PlanetDetailComponent implements OnInit, OnDestroy {
  private readonly route  = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly data   = inject(PlanetDataService);
  private readonly voice  = inject(VoiceService);

  private readonly modalDialog = viewChild<ElementRef<HTMLElement>>('modalDialog');
  private readonly closeButton = viewChild<ElementRef<HTMLButtonElement>>('closeButton');

  readonly planet        = signal<Planet | null>(null);
  readonly allPlanets    = signal<Planet[]>([]);
  readonly activeTab     = signal<SidebarTab>(null);
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
    this.route.paramMap
      .pipe(
        switchMap(() => this.data.getAll()),
        takeUntilDestroyed()
      )
      .subscribe(sys => {
        this.allPlanets.set(sys.records);
        const name  = this.route.snapshot.paramMap.get('planet') ?? '';
        const found = sys.records.find(p => p.name === name) ?? null;
        if (!found) {
          this.router.navigateByUrl('/galaxy');
        } else {
          this.planet.set(found);
        }
      });

    this.voice.commands$.pipe(takeUntilDestroyed()).subscribe(cmd => {
      if (cmd.type === 'sidebar' && cmd.payload) this.toggleTab(cmd.payload as SidebarTab);
      if (cmd.type === 'gallery')                this.openGallery();
      if (cmd.type === 'home')                   this.router.navigateByUrl('/galaxy');
      if (cmd.type === 'navigate' && cmd.payload) this.router.navigateByUrl('/' + cmd.payload);
    });
  }

  ngOnInit(): void    { this.voice.start(); }
  ngOnDestroy(): void { this.voice.stop(); speechSynthesis.cancel(); }

  toggleTab(tab: SidebarTab): void {
    this.activeTab.update(current => (current === tab ? null : tab));
  }

  hoverMoon(moon: Moon | null): void { this.hoveredMoon.set(moon); }

  moonImageUrl(planetName: string, moonName: string): string {
    return `url(assets/img/${moonName}.jpg)`;
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
    if (event.key === 'ArrowRight') this.nextSlide();
  }

  readActiveText(): void {
    const tab = this.activeTab();
    const p   = this.planet();
    if (!p || !tab) return;
    const content =
      tab === 'intro'       ? p.contents?.introduction?.content?.join(' ') :
      tab === 'description' ? p.contents?.description?.content?.join(' ')  : '';
    if (content) {
      const utt = new SpeechSynthesisUtterance(content);
      speechSynthesis.speak(utt);
    }
  }

  navigatePlanet(name: string): void {
    this.router.navigateByUrl('/' + name);
  }
}
