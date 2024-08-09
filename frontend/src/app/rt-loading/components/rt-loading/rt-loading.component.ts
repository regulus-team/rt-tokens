import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostBinding, Input, ViewChild} from '@angular/core';
import {RtPlatformService} from '../../../rt-platform/services/rt-platform/rt-platform.service';
import {fadeOutAnimation} from '../../../shared/animations/fade-out.animation';
import {fadeInAnimation} from '../../../shared/animations/fade-in.animation';
import {toggleOpacityAnimation} from '../../../shared/animations/toggle-opacity.animation';

/** Define in which way content should be transformed. */
enum ContentTransformStrategy {
  /** Content fully hidden and only loader displayed above it. */
  replace = 'replace',

  /** Loader displays above the content. */
  overlay = 'overlay',

  /** Content partially disappears and loader displays above it. */
  disappear = 'disappear',

  /** Replace the content with a skeleton placeholder. */
  skeleton = 'skeleton',
}

/** Describes which loader should be displayed. */
enum LoaderType {
  /** Simple circular loader with casual animation. */
  circular = 'circular',

  /** Linear loader on the top of the content. */
  linear = 'linear',
}

@Component({
  selector: 'rt-loading',
  templateUrl: './rt-loading.component.html',
  styleUrls: ['./rt-loading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInAnimation, fadeOutAnimation, toggleOpacityAnimation(0.5, 1)],
})
export class RtLoadingComponent implements AfterViewInit {
  @ViewChild('content') content: ElementRef;

  @Input() strategy: ContentTransformStrategy = ContentTransformStrategy.disappear;
  @Input() type: LoaderType = LoaderType.linear;
  @Input() circularHeight = 60;
  @Input() linearHeight = 3;
  @Input() linearWidth: number;
  @Input() overlayColor = '#999999';
  @Input() centringCircular = true;
  @Input() isFullWidth = false;

  @HostBinding('style.width') width100: string;

  /** Describes available loader types. Saved in local variables for usage in HTML template. */
  public readonly availableLoaderTypes = LoaderType;

  /** Describes available loader types. Saved in local variables for usage in HTML template. */
  public readonly availableTransformStrategy = ContentTransformStrategy;

  /** Contain actual content height. */
  public contentHeight: number;

  /** Contain actual content width. */
  public contentWidth: number;

  /** Until condition: show loader if this condition is `false`. */
  public untilCondition = true;

  /** While condition: show loader if this condition is `true`. */
  public whileCondition = false;

  /** Result of merging conditions. Indicates if loader should be displayed. */
  public showLoading = !this.until && this.while;

  constructor(protected platform: RtPlatformService) {}

  get until(): boolean {
    return this.untilCondition;
  }

  @Input() set until(untilCondition: boolean) {
    this.untilCondition = untilCondition;
    this.showLoading = !this.until && this.while;
  }

  get while(): boolean {
    return this.whileCondition;
  }

  @Input() set while(whileCondition: boolean) {
    this.whileCondition = whileCondition;
    this.showLoading = !this.until && this.while;
    if (this.showLoading && this.isFullWidth) {
      this.width100 = '100%';
    } else {
      this.width100 = 'auto';
    }
  }

  ngAfterViewInit(): void {
    if (this.platform.isBrowser) {
      const rect = this.content.nativeElement.getBoundingClientRect();
      this.contentHeight = rect.height;
      this.contentWidth = rect.width;
    }
  }
}
