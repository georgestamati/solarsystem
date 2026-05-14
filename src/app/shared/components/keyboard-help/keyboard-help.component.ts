import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { KeyboardService } from '../../../core/services/keyboard.service';

interface Shortcut {
  keys: string[];
  description: string;
}

const SHORTCUTS: Shortcut[] = [
  { keys: ['Ctrl', 'K'],   description: 'Open planet search' },
  { keys: ['\u2190', '\u2192'],     description: 'Navigate between planets (on planet page)' },
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
  private readonly kb = inject(KeyboardService);

  readonly isOpen    = this.kb.helpOpen;
  readonly shortcuts = SHORTCUTS;

  close(): void { this.kb.helpOpen.set(false); }

  onBackdrop(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('help-backdrop')) {
      this.close();
    }
  }
}
