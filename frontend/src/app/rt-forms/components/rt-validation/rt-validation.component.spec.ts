import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RtValidationComponent} from './rt-validation.component';

describe('SliderMultipleComponent', () => {
  let component: RtValidationComponent;
  let fixture: ComponentFixture<RtValidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RtValidationComponent],
    });
    fixture = TestBed.createComponent(RtValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
