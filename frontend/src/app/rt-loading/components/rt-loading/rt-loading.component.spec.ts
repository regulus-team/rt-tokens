import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {RtLoadingComponent} from './rt-loading.component';
import {Settings} from '../../../../conf/settings';


describe('RtLoadingComponent', () => {
  let component: RtLoadingComponent;
  let fixture: ComponentFixture<RtLoadingComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [RtLoadingComponent],
        imports: [BrowserAnimationsModule],
        providers: [Settings],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RtLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
