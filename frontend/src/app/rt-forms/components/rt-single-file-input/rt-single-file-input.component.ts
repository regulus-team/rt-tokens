import {BehaviorSubject, filter, from, map, Observable, of, startWith, Subscription, switchMap} from 'rxjs';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Optional,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {AsyncPipe, NgClass, NgStyle} from '@angular/common';
import {MatTooltip} from '@angular/material/tooltip';
import {ControlContainer, ControlValueAccessor, FormControl, FormGroupDirective, NgControl, NgForm} from '@angular/forms';
import {MatError} from '@angular/material/form-field';
import {MatButton} from '@angular/material/button';
import {isFileTypeAcceptable} from '../../symbols/rt-forms-utils.symbols';
import {RtValidationErrorHandleStrategy} from '../../symbols/rt-forms-types.symbols';
import {
  extractCombinedStatusesFromFormControl,
  FormControlCombinedStatuses,
  formControlCombinedStatusesAdapter,
} from '../../symbols/rt-forms-control-status-adapter.symbols';
import {RtFormsDefineErrorMessagePipe} from '../../pipes/rt-forms-define-error-message/rt-forms-define-error-message';
import {rtFormsDefineInvalidityObservable, rtFormsOverwriteNgControlResetFunction} from '../../symbols/rt-forms-validity.symbols';

/**
 * Describes a file metadata used for generating a preview.
 */
interface FilePreview {
  /** Base64 encoded file content (present only if a submitted file is image). */
  src: string;

  /** File type. */
  type: string;

  /** File name. */
  name: string;

  /** File extension. */
  extension: string;

  /** Indicates whether the file is an image. */
  isImage: boolean;
}

@Component({
  selector: 'rt-single-file-input',
  templateUrl: './rt-single-file-input.component.html',
  styleUrls: ['./rt-single-file-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, NgStyle, MatTooltip, NgClass, RtFormsDefineErrorMessagePipe, MatError, MatButton],
})
export class RtSingleFileInputComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @ViewChild('dragAndDropArea') public dragAndDropArea?: ElementRef<HTMLDivElement>;

  /** Label for the drop area. */
  @Input() dropFileLabel: string;

  /** Label for the action button. */
  @Input() actionButtonLabel: string;

  /** Error handle strategy. */
  @Input() errorHandleStrategy: RtValidationErrorHandleStrategy = RtValidationErrorHandleStrategy.afterSubmit;

  /** Relation between the error name imposed by Validators and the error message. */
  @Input() validationMessages: Nullable<{[key: string]: string}>;

  /** Observable with the preview of the currently selected file. */
  public filePreview$: Observable<Nullable<FilePreview>>;

  /**
   * Child elements also trigger leave and enter events.
   * Increase counter on each entering and decrease on each leave, so if counter > 0 => element is over droppable area.
   */
  public enterAndLeaveDifference = 0;

  /** Triggered whether the value is changed. Will be overwritten by Angular forms. */
  public onChange?: (value: Nullable<File>) => void;

  /** Triggered whether the control is touched. Will be overwritten by Angular forms. */
  public onTouched?: () => void;

  /** Form control for the single file input. */
  public readonly singleFileInputControl = new FormControl<Nullable<File>>(null);

  /** Observable with the current value of the single file input. */
  public readonly singleFileInputCurrentValue$: Observable<Nullable<File>> = this.singleFileInputControl.valueChanges.pipe(
    startWith(this.singleFileInputControl.value),
  );

  /** Component subscriptions. Will be unsubscribed on component destroy. */
  public readonly subscription = new Subscription();

  /** Indicates whether the control is submitted. */
  public readonly isControlSubmitted$ = new BehaviorSubject(false);

  /** Observable with the combined statuses of the form control. */
  public providedControlStatuses$: Observable<FormControlCombinedStatuses>;

  /** Indicates whether the validation should be displayed. */
  public shouldIndicateInvalidity$: Observable<boolean>;

  /** List of acceptable file types as a string. */
  public acceptableFileTypesString = '';

  /** List of acceptable file types. */
  protected acceptableFileTypesList: string[] = [];

  @HostBinding('class.disabled') protected isDisabled = false;

  constructor(
    private ngZone: NgZone,
    protected renderer: Renderer2,
    public ngControl: NgControl,
    @Optional() public controlContainer: ControlContainer,
  ) {
    // Use the `ngControl` to access the related form control.
    // The `NG_VALUE_ACCESSOR` provider was removed from the component, as it is assigned here directly.
    ngControl.valueAccessor = this;

    // Observe the form submit event if the related strategy is set.
    if (this.errorHandleStrategy === RtValidationErrorHandleStrategy.afterSubmit) {
      if (!controlContainer) {
        throw new Error(
          `The controlContainer is not found.
           It is impossible to show validation on form submit event if no form is provided.
           The ${RtSingleFileInputComponent.name} should be used within a <form>.
           If this is intended, change the errorHandleStrategy to the different value.`,
        );
      }

      // Observe the form submit event to update the submitted state.
      if (controlContainer instanceof NgForm || controlContainer instanceof FormGroupDirective) {
        this.subscription.add(
          controlContainer.ngSubmit.subscribe(() => {
            this.isControlSubmitted$.next(true);
          }),
        );
      }
    }
  }

  /**
   * Getter for the acceptable file types.
   */
  get acceptableFileTypes(): string[] {
    return this.acceptableFileTypesList;
  }

  /**
   * Array of acceptable file types.
   * If not provided, all file types are accepted.
   */
  @Input() set acceptableFileTypes(acceptableFileTypes: string[]) {
    this.acceptableFileTypesList = acceptableFileTypes;
    this.acceptableFileTypesString = acceptableFileTypes.join(', ');
  }

  ngOnInit(): void {
    // Overwrite the reset function of the control to reset the submitted state.
    rtFormsOverwriteNgControlResetFunction(this.ngControl, this.isControlSubmitted$);

    // Define the single event object based on the form control events.
    if (this.ngControl?.control?.events) {
      this.providedControlStatuses$ = this.ngControl.control.events.pipe(
        formControlCombinedStatusesAdapter(extractCombinedStatusesFromFormControl(this.ngControl.control)),
      );
    }

    // Determine whether the control should be displayed as invalid.
    this.shouldIndicateInvalidity$ = rtFormsDefineInvalidityObservable(
      this.providedControlStatuses$,
      this.isControlSubmitted$,
      this.errorHandleStrategy,
    );

    // Update the control statuses based on the provided statuses.
    this.subscription.add(
      this.providedControlStatuses$.subscribe(status => {
        const currentControlState = extractCombinedStatusesFromFormControl(this.singleFileInputControl);

        // If touched status is not synced, update the control status.
        if (status.touched !== currentControlState.touched) {
          if (status.touched) {
            this.singleFileInputControl.markAsTouched();
          } else {
            this.singleFileInputControl.markAsUntouched();
          }
        }

        // If pristine status is not synced, update the control status.
        if (status.pristine !== currentControlState.pristine) {
          if (status.pristine) {
            this.singleFileInputControl.markAsPristine();
          } else {
            this.singleFileInputControl.markAsDirty();
          }
        }
      }),
    );

    // Notify the value accessor about the touch events in the input field.
    this.subscription.add(
      this.singleFileInputControl.events
        .pipe(
          // Cast the event to the Partial<FormControlCombinedStatuses> type as there is no way to cast it to the exact type.
          map(event => event as unknown as Partial<FormControlCombinedStatuses>),

          // Filter the statuses that are touched.
          filter(statuses => !!statuses?.touched),
        )
        .subscribe(() => {
          // Notify the value accessor about the touch events in the input field.
          if (this.onTouched) {
            this.onTouched();
          }
        }),
    );

    // Generate a preview for the currently selected file.
    this.filePreview$ = this.singleFileInputControl.valueChanges.pipe(
      switchMap(file => {
        // Reset preview if a broken file is selected.
        if (!(file instanceof File)) {
          return of(null);
        }

        // Generate a preview for the selected file.
        return this.createPreview(file);
      }),
    );

    // Update the form control value on each change.
    this.subscription.add(
      this.singleFileInputControl.valueChanges.subscribe(value => {
        if (this.onChange) {
          this.onChange(value);
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Required by ControlValueAccessor.
   * Function for overriding the `onChange` class method.
   */
  public registerOnChange(fn: (value: any) => void): void {
    // Override the class method with provided function.
    this.onChange = fn;
  }

  /**
   * Required by ControlValueAccessor.
   * Function for overriding the `onTouched` class method.
   */
  public registerOnTouched(fn: () => void): void {
    // Override the class method with provided function.
    this.onTouched = fn;
  }

  /**
   * Required by ControlValueAccessor.
   * Describes how to update the form model when the value changes.
   */
  public writeValue(value: File): void {
    // Update the input value.
    this.singleFileInputControl.setValue(value, {emitEvent: false});
  }

  /**
   * Required by ControlValueAccessor.
   * Describes what actions should be taken when the control status changes.
   */
  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    if (this.dragAndDropArea) {
      this.renderer.setProperty(this.dragAndDropArea.nativeElement, 'disabled', isDisabled);
    }
  }

  /**
   * Update the local file control value with the provided file.
   * @param file - File to update the control with.
   */
  public safeLocalControlUpdate(file: File): void {
    // Update the control submitted state.
    this.isControlSubmitted$.next(true);

    // Update the control only if the file type is acceptable.
    // Do not invoke control validation logic here, as it should be handled by the form control validators.
    const isLastDroppedFileValid = this.isFileTypeAcceptable(file);
    if (isLastDroppedFileValid) {
      this.singleFileInputControl.setValue(file);
    }
  }

  /**
   * Mark the input as invalid if the dragged file is not acceptable.
   */
  public elementEnteredDroppableArea(event: DragEvent): void {
    // Prevent the browser from opening the file.
    event.preventDefault();
    this.enterAndLeaveDifference++;
  }

  /**
   * Update counter on each "left" event.
   */
  public elementLeftDroppableArea(event: DragEvent): void {
    // Prevent the browser from opening the file.
    event.preventDefault();
    this.enterAndLeaveDifference--;
  }

  /**
   * Update the local file control value with the dropped file.
   */
  public elementDropped(event: DragEvent): void {
    // Prevent the browser from opening the file.
    event.preventDefault();
    if (event?.dataTransfer && event?.dataTransfer?.files?.length > 0) {
      // Extract the file from the event.
      const file = event.dataTransfer.files[0];

      // Set the value of the control to the dropped file.
      this.safeLocalControlUpdate(file);
    }

    // Reset the counter as the element is no longer over the droppable area.
    this.enterAndLeaveDifference = 0;
  }

  /**
   * Update the local file control value with the selected file.
   */
  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input?.files?.[0]) {
      // Extract the file from the input.
      const file = input.files[0];

      // Set the value of the control to the selected file.
      this.safeLocalControlUpdate(file);
    }
  }

  /**
   * Create a preview for the provided file.
   * @param file - File to create a preview for.
   * @returns Observable with the preview of the provided file.
   */
  public createPreview(file: File): Observable<FilePreview> {
    // Create a base preview object with directly available file metadata.
    const basePreview: FilePreview = {
      src: '',
      isImage: false,
      type: file.type,
      name: file.name,
      extension: file.name.split('.').pop()?.toUpperCase() || 'FILE',
    };

    // If the file is not an image, return the base preview.
    if (!file.type.startsWith('image')) {
      return of(basePreview);
    }

    // Otherwise, try to read the file as an image and return the preview.
    return from(
      new Promise<string>(resolve => {
        // Read the file as a data URL.
        const reader = new FileReader();
        reader.onload = (e: any) => {
          // Wrap the result in the Angular zone to trigger change detection.
          this.ngZone.run(() => resolve(e.target.result));
        };
        reader.readAsDataURL(file);
      }),
    ).pipe(
      // Update the preview with the base64 encoded image.
      map(base64String => ({
        ...basePreview,
        isImage: true,
        src: base64String,
      })),
    );
  }

  /**
   * Reset the file input.
   */
  public resetFileInput(): void {
    this.singleFileInputControl.reset();
  }

  /**
   * Check if the file type is acceptable.
   * @param file - File to check.
   */
  protected isFileTypeAcceptable(file: File): boolean {
    // Use utility function to check if the file type is acceptable.
    return isFileTypeAcceptable(file, this.acceptableFileTypesList);
  }
}
