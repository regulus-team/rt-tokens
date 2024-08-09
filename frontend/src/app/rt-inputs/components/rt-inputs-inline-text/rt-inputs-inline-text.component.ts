import {BehaviorSubject, filter, map, Observable, Subscription} from 'rxjs';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  FormGroupDirective,
  NgControl,
  NgForm,
  ReactiveFormsModule,
} from '@angular/forms';
import {MatError, MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {AsyncPipe, NgClass} from '@angular/common';
import {RtValidationErrorHandleStrategy} from '../../symbols/rt-inputs-types.symbols';
import {RtInputsDefineErrorMessagePipe} from '../../pipes/rt-inputs-define-error-message/rt-inputs-define-error-message';
import {
  extractCombinedStatusesFromFormControl,
  FormControlCombinedStatuses,
  formControlCombinedStatusesAdapter,
} from '../../symbols/rt-inputs-control-status-adapter.symbols';
import {rtFormsDefineInvalidityObservable, rtFormsOverwriteNgControlResetFunction} from '../../symbols/rt-inputs-validity.symbols';

@Component({
  selector: 'rt-inputs-inline-text',
  templateUrl: './rt-inputs-inline-text.component.html',
  styleUrls: ['./rt-inputs-inline-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatFormField, AsyncPipe, MatInput, ReactiveFormsModule, RtInputsDefineErrorMessagePipe, MatError, NgClass],
})
export class RtInputsInlineTextComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @ViewChild('textInputElement') public textInputElement?: ElementRef<HTMLInputElement>;

  /** Placeholder for the input field. */
  @Input() placeholder: Nullable<string | undefined>;

  /** Type of the input field. */
  @Input() inputType = 'text';

  /** Error handle strategy. */
  @Input() errorHandleStrategy: RtValidationErrorHandleStrategy = RtValidationErrorHandleStrategy.afterLeft;

  /** Relation between the error name imposed by Validators and the error message. */
  @Input() validationMessages: Nullable<{[key: string]: string}>;

  /** Triggered whether the value is changed. Will be overwritten by Angular forms. */
  public onChange?: (value: Nullable<string>) => void;

  /** Triggered whether the control is touched. Will be overwritten by Angular forms. */
  public onTouched?: () => void;

  /** Observable with the combined statuses of the form control. */
  public providedControlStatuses$: Observable<FormControlCombinedStatuses>;

  /** Indicates whether the validation should be displayed. */
  public shouldIndicateInvalidity$: Observable<boolean>;

  /** Form control for the input field. */
  public readonly textInputControl = new FormControl<string>('');

  /** Component subscriptions. Will be unsubscribed on component destroy. */
  public readonly subscription = new Subscription();

  /** Indicates whether the control is submitted. */
  public readonly isControlSubmitted$ = new BehaviorSubject(false);

  @HostBinding('class.disabled') protected isDisabled = false;

  constructor(
    protected renderer: Renderer2,
    public ngControl: NgControl,
    @Optional() public controlContainer: ControlContainer,
  ) {
    // Use the `ngControl` to access the related form control.
    ngControl.valueAccessor = this;

    // Observe the form submit event if the related strategy is set.
    if (
      this.errorHandleStrategy === RtValidationErrorHandleStrategy.afterLeft ||
      this.errorHandleStrategy === RtValidationErrorHandleStrategy.afterEdit
    ) {
      if (!controlContainer) {
        throw new Error(
          `The controlContainer is not found.
           It is impossible to show validation on form submit event if no form is provided.
           The ${RtInputsInlineTextComponent.name} should be used within a <form>.
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
        const currentControlState = extractCombinedStatusesFromFormControl(this.textInputControl);

        // If touched status is not synced, update the control status.
        if (status.touched !== currentControlState.touched) {
          if (status.touched) {
            this.textInputControl.markAsTouched();
          } else {
            this.textInputControl.markAsUntouched();
          }
        }

        // If pristine status is not synced, update the control status.
        if (status.pristine !== currentControlState.pristine) {
          if (status.pristine) {
            this.textInputControl.markAsPristine();
          } else {
            this.textInputControl.markAsDirty();
          }
        }
      }),
    );

    // Notify the value accessor about the touch events in the input field.
    this.subscription.add(
      this.textInputControl.events
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

    // Notify the value accessor about the changes in the input field.
    this.subscription.add(
      this.textInputControl.valueChanges.subscribe(value => {
        // Notify the value accessor about the changes in the input field.
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
  public writeValue(value: unknown): void {
    // Convert the value to a string.
    const safeValue = typeof value === 'string' ? value : value?.toString() || '';

    // Update the input value.
    this.textInputControl.setValue(safeValue, {emitEvent: false});
  }

  /**
   * Required by ControlValueAccessor.
   * Describes what actions should be taken when the control status changes.
   */
  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    if (this.textInputElement) {
      this.renderer.setProperty(this.textInputElement.nativeElement, 'disabled', isDisabled);
    }
  }
}
