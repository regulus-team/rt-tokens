import {HttpClient} from '@angular/common/http';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {Subscription} from 'rxjs';
import {RtPlatformService} from '../../rt-platform/rt-platform.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'rt-svg-sprite',
  templateUrl: './rt-svg-sprite.component.html',
  styleUrls: ['./rt-svg-sprite.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RtSvgSpriteComponent implements OnInit, OnDestroy {
  icons: SafeHtml = '';

  subscription = new Subscription();

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private platform: RtPlatformService,
  ) {}

  ngOnInit(): void {
    if (this.platform.isBrowser) {
      this.subscription.add(
        this.http.get('/assets/symbol/sprites.svg', {responseType: 'text'}).subscribe(res => {
          this.icons = this.sanitizer.bypassSecurityTrustHtml(res);
          this.cdr.markForCheck();
        }),
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
