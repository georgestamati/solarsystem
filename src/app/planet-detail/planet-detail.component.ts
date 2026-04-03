import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { PlanetDataService, Planet, Moon } from '../services/planet-data.service';
import { SocketService } from '../services/socket.service';
import { VoiceService } from '../services/voice.service';
import { MenuComponent } from '../menu/menu.component';
import { TitleCasePipe, KeyValuePipe } from '@angular/common';

type SidebarTab = 'profile' | 'intro' | 'description' | null;

@Component({
  selector: 'app-planet-detail',
  standalone: true,
  imports: [MenuComponent, TitleCasePipe, KeyValuePipe],
  templateUrl: './planet-detail.component.html',
  styleUrl: './planet-detail.component.scss'
})
export class PlanetDetailComponent implements OnInit, OnDestroy {
  planet: Planet | null = null;
  allPlanets: Planet[] = [];
  activeTab: SidebarTab = null;
  hoveredMoon: Moon | null = null;
  galleryImages: string[] = [];
  modalOpen = false;
  modalIndex = 0;
  readonly tabs: SidebarTab[] = ['profile', 'intro', 'description'];
  private subs = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private data: PlanetDataService,
    private socket: SocketService,
    private voice: VoiceService
  ) {}

  ngOnInit(): void {
    // Load planet on route param change
    this.subs.add(
      this.route.paramMap.pipe(
        switchMap(params => {
          const name = params.get('planet') ?? '';
          return this.data.getAll();
        })
      ).subscribe(sys => {
        this.allPlanets = sys.records;
        const name = this.route.snapshot.paramMap.get('planet') ?? '';
        this.planet = sys.records.find(p => p.name === name) ?? null;
        if (!this.planet) this.router.navigateByUrl('/galaxy');
      })
    );

    // Mobile remote: open sidebar tab or gallery
    this.subs.add(
      this.socket.on<{ value: string }>('showMobileInfoOnDesktop').subscribe(data => {
        if (data.value === 'display images') {
          this.openGallery();
        } else if (data.value === 'read text') {
          this.readActiveText();
        } else {
          this.toggleTab(data.value as SidebarTab);
        }
      })
    );

    // Mobile remote: show moon tooltip
    this.subs.add(
      this.socket.on<{ id: string; click: boolean }>('showTooltipOnDesktop').subscribe(data => {
        if (this.planet?.moons) {
          this.hoveredMoon = this.planet.moons.find(m => m.name === data.id) ?? null;
        }
      })
    );

    // Voice
    this.voice.start();
    this.subs.add(
      this.voice.commands$.subscribe(cmd => {
        if (cmd.type === 'sidebar' && cmd.payload) this.toggleTab(cmd.payload as SidebarTab);
        if (cmd.type === 'gallery') this.openGallery();
        if (cmd.type === 'home') this.router.navigateByUrl('/galaxy');
        if (cmd.type === 'navigate' && cmd.payload) this.router.navigateByUrl('/' + cmd.payload);
      })
    );
  }

  toggleTab(tab: SidebarTab): void {
    this.activeTab = this.activeTab === tab ? null : tab;
  }

  hoverMoon(moon: Moon | null): void {
    this.hoveredMoon = moon;
  }

  openGallery(): void {
    if (!this.planet) return;
    // Use NASA image API or fallback to local images
    const name = this.planet.name;
    this.galleryImages = this.getLocalImages(name);
    this.modalOpen = true;
    this.modalIndex = 0;
  }

  private getLocalImages(name: string): string[] {
    // Return known local image paths for the planet
    return [`img/planets/${name}.jpg`, `img/planets/${name}_hd.jpg`].filter(Boolean);
  }

  prevSlide(): void {
    this.modalIndex = (this.modalIndex - 1 + this.galleryImages.length) % this.galleryImages.length;
  }

  nextSlide(): void {
    this.modalIndex = (this.modalIndex + 1) % this.galleryImages.length;
  }

  closeModal(): void {
    this.modalOpen = false;
  }

  readActiveText(): void {
    if (!this.planet || !this.activeTab || this.activeTab === 'profile') return;
    const tabKey = this.activeTab === 'intro' ? 'introduction' : this.activeTab;
    const section = this.planet.contents?.[tabKey as 'introduction' | 'description'];
    const content = section?.content ?? [];
    const text = content.join(' ');
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  }

  descriptionEntries(): { key: string; value: string }[] {
    if (!this.planet?.description) return [];
    return Object.entries(this.planet.description).map(([key, value]) => ({ key, value }));
  }

  ngOnDestroy(): void {
    this.voice.stop();
    speechSynthesis.cancel();
    this.subs.unsubscribe();
  }
}
