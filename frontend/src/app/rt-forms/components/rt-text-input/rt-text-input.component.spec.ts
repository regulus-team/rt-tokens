import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CheckboxInArrayComponent} from './rt-text-input.component';

describe('SliderMultipleComponent', () => {
  let component: CheckboxInArrayComponent<any>;
  let fixture: ComponentFixture<CheckboxInArrayComponent<any>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CheckboxInArrayComponent],
    });
    fixture = TestBed.createComponent(CheckboxInArrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
