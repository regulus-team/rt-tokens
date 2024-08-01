import {BehaviorSubject, Subject, Subscription, switchMap, timer} from 'rxjs';
import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {MatTooltip} from '@angular/material/tooltip';
import {CdkCopyToClipboard} from '@angular/cdk/clipboard';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-shared-copy-action',
  templateUrl: './shared-copy-action.component.html',
  styleUrls: ['./shared-copy-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatTooltip, CdkCopyToClipboard, AsyncPipe],
})
export class SharedCopyActionComponent implements OnInit, OnDestroy {
  /** Content to copy to the clipboard. */
  @Input() public contentToCopy = '';

  /** Text to display in the tooltip. */
  @Input() public tooltipText = 'Copy to clipboard';

  /** Text to display in the tooltip when the content is copied. */
  @Input() public tooltipCopiedText = 'Copied to clipboard';

  /** Indicates whether the mouse events should be stopped from propagating. */
  @Input() public stopEventPropagation = true;

  /** Indicates whether the default event should be prevented. */
  @Input() public preventEventDefault = true;

  /** Delay before resetting the copied status (ms). */
  @Input() public resetCopiedStatusDelay = 3000;

  /** Event emitted when the content is copied to the clipboard. */
  @Output() public contentCopied = new EventEmitter<string>();

  /** Indicates whether the item copied icon should be shown. */
  public isItemCopiedStatus$ = new BehaviorSubject(false);

  /** Subject for resetting the latest copied token address after a delay. */
  public resetItemCopiedStatus$ = new Subject<void>();

  /** Component's subscriptions. Will be unsubscribed when the component is destroyed. */
  private readonly subscription = new Subscription();

  ngOnInit(): void {
    // Reset the item copied status after a delay.
    this.subscription.add(
      this.resetItemCopiedStatus$.pipe(switchMap(() => timer(this.resetCopiedStatusDelay))).subscribe({
        next: () => this.isItemCopiedStatus$.next(false),
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Copy the provided content to the clipboard.
   * Update the copied status and emit the content copied event.
   * Initialize the reset copied status timer.
   */
  public copiedToClipboard($event: MouseEvent): void {
    // Prevent the click event from bubbling up if required.
    if (this.stopEventPropagation) {
      $event.stopPropagation();
    }

    // Prevent the default action if required.
    if (this.preventEventDefault) {
      $event.preventDefault();
    }

    // Update the status of the item copied.
    this.isItemCopiedStatus$.next(true);

    // Emit the content copied event to the parent component.
    this.contentCopied.emit(this.contentToCopy);

    // Initialize the reset copied status countdown.
    this.resetItemCopiedStatus$.next();
  }
}
