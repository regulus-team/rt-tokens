import {BehaviorSubject, filter, Observable, Subject, Subscription, switchMap, take, timer} from 'rxjs';
import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Select} from '@ngxs/store';
import {DashboardTokenDialogAddNewComponent} from '../dashboard-token-dialog-add-new/dashboard-token-dialog-add-new.component';
import {progressStatuses} from '../../../shared/symbols/statuses.symbols';
import {DashboardTokenListState} from '../../states/dashboard-token-list/dashboard-token-list.state';
import {DashboardTokenListStateModel} from '../../states/dashboard-token-list/dashboard-token-list.model';

@Component({
  selector: 'app-dashboard-token-list',
  templateUrl: './dashboard-token-list.component.html',
  styleUrls: ['./dashboard-token-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardTokenListComponent implements OnInit, OnDestroy {
  @Select(DashboardTokenListState.loadTokenListProcess) loadTokenListProcess$: Observable<
    DashboardTokenListStateModel['loadTokenListProcess']
  >;
  @Select(DashboardTokenListState.tokenListPiledData) tokenListPiledData$: Observable<DashboardTokenListStateModel['tokenListPiledData']>;
  @Select(DashboardTokenListState.lastLoadTokenListError)
  lastLoadTokenListError$: Observable<DashboardTokenListStateModel['lastLoadTokenListError']>;

  /** The latest copied token address. */
  public latestCopiedAddress$ = new BehaviorSubject<Nullable<PublicKeyString>>(null);

  /** Subject for resetting the latest copied token address after a delay. */
  public resetLatestCopiedAddressAfterDelay$ = new Subject<void>();

  /** Delay before resetting the latest copied token address (ms). */
  public readonly resetLatestCopiedAddressDelay = 3000;

  /** Available statuses for common progress processes. */
  public readonly progressStatuses = progressStatuses;

  /** Component subscriptions. Will be unsubscribed on component destroy. */
  public readonly subscription = new Subscription();

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    // Reset the latest copied token address after a delay.
    this.subscription.add(
      this.resetLatestCopiedAddressAfterDelay$.pipe(switchMap(() => timer(this.resetLatestCopiedAddressDelay))).subscribe({
        next: () => {
          this.latestCopiedAddress$.next(null);
        },
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Open a dialog window to add a new token.
   */
  public openAddTokenDialog(): void {
    this.dialog
      .open<DashboardTokenDialogAddNewComponent>(DashboardTokenDialogAddNewComponent, {
        data: {some: 'data'},
        backdropClass: ['rt-dialog'],
        hasBackdrop: true,
      })
      .afterClosed()
      .pipe(
        take(1),
        filter(data => !!data),
      )
      .subscribe({
        next: data => {
          console.log('Data received from the dialog window: ');
          console.log(data);
        },
      });
  }

  /**
   * Copy the token address to the clipboard.
   */
  public tokenAddressCopiedToClipboard($event: MouseEvent, tokenAccount: PublicKeyString): void {
    // Prevent the click event from bubbling up.
    $event.stopPropagation();

    // Store the latest copied token address.
    this.latestCopiedAddress$.next(tokenAccount);
    this.resetLatestCopiedAddressAfterDelay$.next();
  }
}
