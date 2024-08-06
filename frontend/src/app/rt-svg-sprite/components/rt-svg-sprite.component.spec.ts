import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {DomSanitizer} from '@angular/platform-browser';

import {RtSvgSpriteComponent} from './rt-svg-sprite.component';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';

class DomSanitizerMock {}

describe('IconsComponent', () => {
  let component: RtSvgSpriteComponent;
  let fixture: ComponentFixture<RtSvgSpriteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RtSvgSpriteComponent],
      imports: [],
      providers: [
        {
          provide: DomSanitizer,
          useValue: DomSanitizerMock,
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
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
