import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { KeyboardService } from '../services/keyboard.service';

interface Shortcut {
  keys: string[];
  description: string;
}

const SHORTCUTS: Shortcut[] = [
  { keys: ['Ctrl', 'K'],   description: 'Open planet search' },
  { keys: ['←', '→'],     description: 'Navigate between planets (on planet page)' },
  { keys: ['Esc'],         description: 'Close dialogs' },
  { keys: ['?'],           description: 'Toggle this help dialog' },
  { keys: ['⤢'],           description: 'Toggle fullscreen (button, bottom-right)' },
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

  readonly isOpen = this.kb.helpOpen;
  readonly shortcuts = SHORTCUTS;

  close(): void {
    this.kb.helpOpen.set(false);
  }

  onBackdrop(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('help-backdrop')) {
      this.close();
    }
  }
}
