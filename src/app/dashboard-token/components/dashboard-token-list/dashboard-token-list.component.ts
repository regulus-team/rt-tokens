import {filter, Observable, take} from 'rxjs';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Select} from '@ngxs/store';
import {DashboardTokenState} from '../../states/dashboard-token/dashboard-token.state';
import {DashboardTokenStateModel} from '../../states/dashboard-token/dashboard-token.model';
import {progressStatuses} from '../../../shared/symbols/statuses.symbols';
import {MatDialog} from '@angular/material/dialog';
import {DashboardTokenDialogAddNewComponent} from '../dashboard-token-dialog-add-new/dashboard-token-dialog-add-new.component';

@Component({
  selector: 'app-dashboard-token-list',
  templateUrl: './dashboard-token-list.component.html',
  styleUrls: ['./dashboard-token-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardTokenListComponent {
  @Select(DashboardTokenState.loadTokenListProcess) loadTokenListProcess$: Observable<DashboardTokenStateModel['loadTokenListProcess']>;
  @Select(DashboardTokenState.tokenList) tokenList$: Observable<DashboardTokenStateModel['tokenList']>;
  @Select(DashboardTokenState.lastLoadTokenListError)
  lastLoadTokenListError$: Observable<DashboardTokenStateModel['lastLoadTokenListError']>;

  /** Available statuses for common progress processes. */
  protected readonly progressStatuses = progressStatuses;

  constructor(private dialog: MatDialog) {
  }

  public openAddTokenDialog(): void {
    this.dialog.open<DashboardTokenDialogAddNewComponent>(DashboardTokenDialogAddNewComponent, {
      data: {some: 'data'},
      backdropClass: ['rt-dialog'],
      hasBackdrop: true,
    })
      .afterClosed()
      .pipe(take(1), filter(data => !!data))
      .subscribe({
        next: data => {
          console.log('Data received from the dialog window: ');
          console.log(data);
        },
      });
  }
}
