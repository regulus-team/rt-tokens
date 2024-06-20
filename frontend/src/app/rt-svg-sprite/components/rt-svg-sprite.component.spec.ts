import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {DomSanitizer} from '@angular/platform-browser';

import {RtSvgSpriteComponent} from './rt-svg-sprite.component';

class DomSanitizerMock {}

describe('IconsComponent', () => {
  let component: RtSvgSpriteComponent;
  let fixture: ComponentFixture<RtSvgSpriteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RtSvgSpriteComponent],
      imports: [HttpClientTestingModule],
      providers: [{provide: DomSanitizer, useValue: DomSanitizerMock}],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RtSvgSpriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
