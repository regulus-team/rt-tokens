import {ChangeDetectionStrategy, Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Store} from '@ngxs/store';
import {MatButton} from '@angular/material/button';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CreateFungibleToken} from '../../states/dashboard-token-item-actions/dashboard-token-item-actions.actions';
import {
  RtFormLabelsFromForm,
  RtFormPlaceholdersFromForm,
  RtValidationMessagesFromForm,
} from '../../../rt-forms/symbols/rt-forms-types.symbols';
import {RtFormsModule} from '../../../rt-forms/rt-forms.module';
import {RtValidators} from '../../../rt-forms/symbols/rt-forms-validators.symbols';
import {RtTextInputComponent} from '../../../rt-forms/components/rt-text-input/rt-text-input.component';

@Component({
  selector: 'app-dashboard-token-dialog-add-new',
  templateUrl: './dashboard-token-dialog-add-new.component.html',
  styleUrls: ['./dashboard-token-dialog-add-new.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RtFormsModule, MatButton, RtTextInputComponent],
  standalone: true,
})
export class DashboardTokenDialogAddNewComponent {
  @ViewChild('fileInput') fileInput: ElementRef;

  /** List of acceptable file types for the image form field. */
  public readonly acceptableTypesForImage = ['.png', '.jpg', '.jpeg', '.svg'];

  /** Form for creating a new fungible token. */
  public readonly createTokenForm = new FormGroup({
    name: new FormControl<string>('', [Validators.required, Validators.maxLength(16), Validators.pattern(/^[0-9A-Za-z]*$/)]),
    symbol: new FormControl<string>('', [Validators.required, Validators.maxLength(16), Validators.pattern(/^[0-9A-Za-z$]*$/)]),
    decimals: new FormControl<number>(0, [Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]*$')]),
    description: new FormControl<string>('', [Validators.required, Validators.maxLength(128)]),
    image: new FormControl<Nullable<File>>(null, [Validators.required, RtValidators.fileTypeValidator(this.acceptableTypesForImage)]),
  });

  /** Relation of placeholders to each registration form field. */
  public readonly placeholders: Partial<RtFormPlaceholdersFromForm<typeof this.createTokenForm>> = {
    name: 'Token name',
    symbol: 'Token symbol',
    decimals: 'Number of decimals for the token',
    description: 'Description of the token',
  };

  /** Relation of labels for the token creation form. */
  public readonly labels: RtFormLabelsFromForm<typeof this.createTokenForm> = {
    name: 'Name',
    symbol: 'Symbol',
    decimals: 'Decimals',
    description: 'Description',
    image: 'Token Image',
  };

  /** Relation of error messages to each control validator. */
  public readonly validationMessages: RtValidationMessagesFromForm<typeof this.createTokenForm> = {
    name: {
      required: `Token name is required`,
      maxlength: `Token name should not be more than 16 characters`,
      pattern: `Token name can only contain letters and numbers`,
    },
    symbol: {
      required: `Token symbol is required`,
      maxlength: `Token symbol should not be more than 16 characters`,
      pattern: `Token symbol can only contain letters, numbers, and $ symbol`,
    },
    decimals: {
      required: `Token decimals is required`,
      maxlength: `Token decimals should not be more than 2 characters`,
      pattern: 'The value must be an integer',
    },
    description: {
      required: `Token description is required`,
      maxlength: `Token description should not be more than 128 characters`,
    },
    image: {
      required: `Token image is required`,
      invalidFileObject: `Broken file object provided`,
      fileType: `Token image should be a PNG, JPG, JPEG, or SVG file`,
    },
  };

  constructor(
    private dialog: MatDialogRef<DashboardTokenDialogAddNewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {avatar: string},
    private store: Store,
  ) {}

  /**
   * Send the form if all fields are valid.
   * Otherwise, display validation messages.
   */
  public onSubmit(): void {
    if (this.createTokenForm.valid) {
      console.log('Form is valid');
      // this.store.dispatch(new CreateFungibleToken(this.form.value as CreateFungibleTokenActionData));
    }
  }

  /**
   * Create a new mint account, associated token account, metadata, and link them together.
   */
  public createFungibleAsset(file: File): void {
    this.store.dispatch(
      new CreateFungibleToken({
        name: 'NRT5',
        symbol: '$NRT5',
        description: 'metadata test 5',
        image: file,
        decimals: 5,
      }),
    );

    // Close the dialog.
    this.dialog.close();
  }

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      this.createFungibleAsset(file);
    }
  }
}
