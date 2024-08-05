import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {DashboardTokenDialogBurnTokenComponent} from './dashboard-token-dialog-burn-token.component';

describe('AppComponent', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [DashboardTokenDialogBurnTokenComponent],
    }),
  );

  it('should create the app', () => {
    const fixture = TestBed.createComponent(DashboardTokenDialogBurnTokenComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(DashboardTokenDialogBurnTokenComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('airdrop app is running!');
  });
});
