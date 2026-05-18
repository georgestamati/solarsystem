import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DesktopWelcomeComponent } from './desktop-welcome.component';

describe('DesktopWelcomeComponent', () => {
  let fixture: ComponentFixture<DesktopWelcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesktopWelcomeComponent, RouterTestingModule],
    }).compileComponents();
    fixture = TestBed.createComponent(DesktopWelcomeComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render without errors', () => {
    expect(fixture.nativeElement).toBeTruthy();
  });
});
