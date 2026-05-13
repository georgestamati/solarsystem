import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  signal,
} from '@angular/core';

interface Shortcut {
  keys: string[];
  description: string;
}

const SHORTCUTS: Shortcut[] = [
  { keys: ['Ctrl', 'K'],   description: 'Open planet search' },
  { keys: ['←', '→'],     description: 'Navigate between planets (on planet page)' },
  { keys: ['Esc'],         description: 'Close dialogs / Go to galaxy' },
  { keys: ['?'],           description: 'Show this help dialog' },
  { keys: ['F'],           description: 'Toggle fullscreen' },
];

@Component({
  selector: 'app-keyboard-help',
  standalone: true,
  templateUrl: './keyboard-help.component.html',
  styleUrl: './keyboard-help.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyboardHelpComponent {
  readonly isOpen = signal(false);
  readonly shortcuts = SHORTCUTS;

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    const tag = (e.target as HTMLElement).tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      this.isOpen.update(v => !v);
    }
    if (e.key === 'Escape' && this.isOpen()) {
      this.isOpen.set(false);
    }
  }

  close(): void {
    this.isOpen.set(false);
  }

  onBackdrop(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('help-backdrop')) {
      this.close();
    }
  }
}
