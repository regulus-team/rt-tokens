import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {RtWalletAuthRootComponent} from './rt-wallet-auth-root.component';

describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule],
    declarations: [RtWalletAuthRootComponent],
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(RtWalletAuthRootComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(RtWalletAuthRootComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('airdrop app is running!');
  });
});
