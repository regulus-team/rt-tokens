import {filter, take} from 'rxjs';
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Store} from '@ngxs/store';
import {PublicKey} from '@solana/web3.js';
import {DashboardTokenDialogAddNewComponent} from '../dashboard-token-dialog-add-new/dashboard-token-dialog-add-new.component';
import {DashboardTokenListState} from '../../states/dashboard-token-list/dashboard-token-list.state';
import {LoadTokenList} from '../../states/dashboard-token-list/dashboard-token-list.actions';
import {progressStatuses} from '../../../shared/symbols/statuses.symbols';
import {RtSolanaService} from '../../../rt-solana/services/rt-solana/rt-solana.service';

@Component({
  selector: 'app-dashboard-token-list',
  templateUrl: './dashboard-token-list.component.html',
  styleUrls: ['./dashboard-token-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardTokenListComponent implements OnInit {
  public readonly loadTokenListProcess$ = this.store.select(DashboardTokenListState.loadTokenListProcess);
  public readonly tokenListPiledData$ = this.store.select(DashboardTokenListState.tokenListPiledData);
  public readonly lastLoadTokenListError$ = this.store.select(DashboardTokenListState.lastLoadTokenListError);

  /** Available statuses for common progress processes. */
  public readonly progressStatuses = progressStatuses;

  constructor(
    private dialog: MatDialog,
    private store: Store,
    private rtSolana: RtSolanaService,
  ) {}

  ngOnInit(): void {
    // Extract the public key from the wallet adapter.
    // It can be null as the page is protected by the router guard.
    const currentAccount: PublicKey = this.rtSolana.currentWalletAdapter.publicKey as PublicKey;

    // Initialize the token list loading process.
    this.store.dispatch(new LoadTokenList(currentAccount));
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
}
