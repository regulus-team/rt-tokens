import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard-token-dialog-mint-token',
  templateUrl: './dashboard-token-dialog-mint-token.component.html',
  styleUrls: ['./dashboard-token-dialog-mint-token.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardTokenDialogMintTokenComponent {
  constructor(
    private dialogRef: MatDialogRef<DashboardTokenDialogMintTokenComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {avatar: string},
  ) {}

  public mintToken(): void {
    this.dialogRef.close(true);
  }
}
