import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DesktopWelcomeComponent } from './desktop-welcome.component';

describe('DesktopWelcomeComponent', () => {
  let fixture: ComponentFixture<DesktopWelcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesktopWelcomeComponent],
      providers: [provideRouter([])],
    });
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
