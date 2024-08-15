import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {DashboardTokenDialogTransferTokenComponent} from './dashboard-token-dialog-transfer-token.component';

describe('AppComponent', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [DashboardTokenDialogTransferTokenComponent],
    }),
  );

  it('should create the app', () => {
    const fixture = TestBed.createComponent(DashboardTokenDialogTransferTokenComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(DashboardTokenDialogTransferTokenComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('airdrop app is running!');
  });
});
