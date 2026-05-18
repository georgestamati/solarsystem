import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KeyboardHelpComponent } from './keyboard-help.component';
import { KeyboardService } from '../../../core/services/keyboard.service';
import { signal } from '@angular/core';

const makeKbStub = () => ({
  helpOpen: signal(false),
  searchOpen: signal(false),
});

describe('KeyboardHelpComponent', () => {
  let fixture: ComponentFixture<KeyboardHelpComponent>;
  let comp: KeyboardHelpComponent;
  let kbStub: ReturnType<typeof makeKbStub>;

  beforeEach(async () => {
    kbStub = makeKbStub();
    await TestBed.configureTestingModule({
      imports: [KeyboardHelpComponent],
      providers: [{ provide: KeyboardService, useValue: kbStub }],
    }).compileComponents();
    fixture = TestBed.createComponent(KeyboardHelpComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(comp).toBeTruthy());

  it('isOpen should reflect KeyboardService.helpOpen', () => {
    expect(comp.isOpen()).toBe(false);
    kbStub.helpOpen.set(true);
    expect(comp.isOpen()).toBe(true);
  });

  it('should expose the SHORTCUTS array', () => {
    expect(comp.shortcuts.length).toBeGreaterThan(0);
  });

  it('close() should set helpOpen to false', () => {
    kbStub.helpOpen.set(true);
    comp.close();
    expect(kbStub.helpOpen()).toBe(false);
  });

  it('onBackdrop() should close when target has help-backdrop class', () => {
    kbStub.helpOpen.set(true);
    const div = document.createElement('div');
    div.classList.add('help-backdrop');
    const event = { target: div } as unknown as MouseEvent;
    comp.onBackdrop(event);
    expect(kbStub.helpOpen()).toBe(false);
  });

  it('onBackdrop() should NOT close when target lacks help-backdrop class', () => {
    kbStub.helpOpen.set(true);
    const div = document.createElement('div');
    const event = { target: div } as unknown as MouseEvent;
    comp.onBackdrop(event);
    expect(kbStub.helpOpen()).toBe(true);
  });
});
