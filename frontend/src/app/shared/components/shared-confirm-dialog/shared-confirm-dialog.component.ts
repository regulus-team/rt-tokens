import {ChangeDetectionStrategy, Component, Inject, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';

/**
 * [Shared]
 * Describes data fields for the confirmation dialog.
 */
export interface ConfirmDialogData {
  /** Custom caption text for confirm dialog. */
  caption?: string;

  /** Custom details text for confirm dialog. */
  detailsText?: string;

  /** Custom confirm button text. */
  confirm?: string;

  /** Custom cancel button text. */
  cancel?: string;
}

/**
 * Default values for confirm dialog component.
 */
const sharedConfirmDialogDefaultValues: Required<ConfirmDialogData> = {
  caption: 'Are you sure you want to continue?',
  detailsText: '',
  confirm: 'Confirm',
  cancel: 'Cancel',
};

@Component({
  selector: 'app-shared-confirm-dialog',
  templateUrl: './shared-confirm-dialog.component.html',
  styleUrls: ['./shared-confirm-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatButton],
})
export class SharedConfirmDialogComponent {
  /** Contain dialog configs. */
  public config: Required<ConfirmDialogData>;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public injectedData: ConfirmDialogData,
    private dialogRef: MatDialogRef<SharedConfirmDialogComponent>,
  ) {
    // Write confirm dialog config as a merging result of injected and default data.
    this.config = Object.assign({}, sharedConfirmDialogDefaultValues, injectedData);
  }

  /**
   * Close dialog and return data (if provided).
   */
  public closeDialog(providedData?: boolean): void {
    this.dialogRef.close(providedData);
  }
}
