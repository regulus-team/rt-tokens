import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Store} from '@ngxs/store';
import {CreateFungibleToken} from '../../states/dashboard-token/dashboard-token.actions';
import {CreateFungibleTokenActionData} from '../../symbols/dashboard-token-action-data.symbols';
import {RtFormValidationComponent} from '../../../rt-forms/rt-form-validation.component';
import {ReactiveFormsModule, UntypedFormBuilder, Validators} from '@angular/forms';
import {
  RtControlNames,
  RtFormFields,
  RtFormLabels,
  RtFormPlaceholders,
  RtValidationMessages,
} from '../../../rt-forms/symbols/rt-forms-types.symbols';
import {markAsTouchedRecursive} from '../../../rt-forms/symbols/rt-forms-utils.symbols';
import {RtFormsModule} from '../../../rt-forms/rt-forms.module';
import {MatButton} from '@angular/material/button';
import {RtValidators} from '../../../rt-forms/symbols/rt-forms-validators.symbols';

@Component({
  selector: 'app-dashboard-token-dialog-add-new',
  templateUrl: './dashboard-token-dialog-add-new.component.html',
  styleUrls: ['./dashboard-token-dialog-add-new.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RtFormsModule, MatButton],
  standalone: true,
})
export class DashboardTokenDialogAddNewComponent extends RtFormValidationComponent<CreateFungibleTokenActionData> implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;

  /** List of acceptable file types for the image form field. */
  public readonly acceptableTypesForImage = ['.png', '.jpg', '.jpeg', '.svg'];

  /** Set up relation between controls and its fields. Defined to avoid errors in HTML template. */
  public readonly formControlNames: RtControlNames<CreateFungibleTokenActionData> = {
    name: 'name',
    symbol: 'symbol',
    decimals: 'decimals',
    description: 'description',
    image: 'image',
  };

  /** Relation of placeholders to each registration form field. */
  public readonly placeholders: RtFormPlaceholders<Partial<CreateFungibleTokenActionData>> = {
    name: 'Token name',
    symbol: 'Token symbol',
    decimals: 'Number of decimals for the token',
    description: 'Description of the token',
  };

  /** Relation of labels for the token creation form. */
  public override readonly labels: RtFormLabels<CreateFungibleTokenActionData> = {
    name: 'Name',
    symbol: 'Symbol',
    decimals: 'Decimals',
    description: 'Description',
    image: 'Token Image',
  };

  /** Relation of form controls to its validators. */
  public override readonly formFields: RtFormFields<CreateFungibleTokenActionData> = {
    name: [Validators.required, Validators.maxLength(16), Validators.pattern(/^[0-9A-Za-z]*$/)],
    symbol: [Validators.required, Validators.maxLength(16), Validators.pattern(/^[0-9A-Za-z$]*$/)],
    decimals: [Validators.required, Validators.maxLength(2)],
    description: [Validators.required, Validators.maxLength(128)],
    image: [Validators.required, RtValidators.fileTypeValidator(this.acceptableTypesForImage)],
  };

  /** Relation of error messages to each control validator. */
  public override readonly validationMessages: RtValidationMessages<CreateFungibleTokenActionData> = {
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
    protected override fb: UntypedFormBuilder,
    protected override cd: ChangeDetectorRef,
    protected override store: Store,
    private dialog: MatDialogRef<DashboardTokenDialogAddNewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {avatar: string},
  ) {
    super(fb, cd, store);
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  /**
   * Send the form if all fields are valid.
   * Otherwise, display validation messages.
   */
  public onSubmit(): void {
    console.log('form: ', this.form.value);
    if (this.form.valid) {
      // this.store.dispatch(new CreateFungibleToken(this.form.value as CreateFungibleTokenActionData));
    } else {
      markAsTouchedRecursive(this.form);
      super.submitForm();
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
