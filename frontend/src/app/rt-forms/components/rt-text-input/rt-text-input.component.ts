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
import {RtValidationErrorHandleStrategy} from '../../symbols/rt-forms-types.symbols';
import {RtFormsDefineErrorMessagePipe} from '../../pipes/rt-forms-define-error-message/rt-forms-define-error-message';
import {FormControlCombinedStatuses, formControlCombinedStatusesAdapter} from '../../symbols/rt-forms-control-status-adapter.symbols';
import {rtFormsDefineInvalidityObservable} from '../../symbols/rt-forms-validity.symbols';

@Component({
  selector: 'rt-text-input',
  templateUrl: './rt-text-input.component.html',
  styleUrls: ['./rt-text-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatFormField, AsyncPipe, MatInput, ReactiveFormsModule, RtFormsDefineErrorMessagePipe, MatError, NgClass],
})
export class RtTextInputComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @ViewChild('textInputElement') public textInputElement?: ElementRef<HTMLInputElement>;

  /** Placeholder for the input field. */
  @Input() placeholder: Nullable<string | undefined>;

  /** Type of the input field. */
  @Input() inputType = 'text';

  /** Error handle strategy. */
  @Input() errorHandleStrategy: RtValidationErrorHandleStrategy = RtValidationErrorHandleStrategy.afterSubmit;

  /** Relation between the error name imposed by Validators and the error message. */
  @Input() validationMessages: Nullable<{[key: string]: string}>;

  /** Triggered whether the value is changed. Will be overwritten by Angular forms. */
  public onChange?: (value: Nullable<string>) => void;

  /** Triggered whether the control is touched. Will be overwritten by Angular forms. */
  public onTouched?: () => void;

  /** Indicates whether the validation should be displayed. */
  public shouldIndicateInvalidity$: Observable<boolean>;

  /** Form control for the input field. */
  public readonly textInputControl = new FormControl<string>('');

  /** Component subscriptions. Will be unsubscribed on component destroy. */
  public readonly subscription = new Subscription();

  /** Indicates whether the control container is submitted. */
  public readonly isControlContainerSubmitted$ = new BehaviorSubject(false);

  @HostBinding('class.disabled') protected isDisabled = false;

  constructor(
    protected renderer: Renderer2,
    public ngControl: NgControl,
    @Optional() public controlContainer: ControlContainer,
  ) {
    // Use the `ngControl` to access the related form control.
    ngControl.valueAccessor = this;

    // Observe the form submit event if the related strategy is set.
    if (this.errorHandleStrategy === RtValidationErrorHandleStrategy.afterSubmit) {
      if (!controlContainer) {
        throw new Error(
          `The controlContainer is not found.
           It is impossible to show validation on form submit event if no form is provided.
           The ${RtTextInputComponent.name} should be used within a <form>.
           If this is intended, change the errorHandleStrategy to the different value.`,
        );
      }

      if (controlContainer instanceof NgForm) {
        controlContainer.ngSubmit.subscribe(() => {
          this.isControlContainerSubmitted$.next(true);
        });
      } else if (controlContainer instanceof FormGroupDirective) {
        controlContainer.ngSubmit.subscribe(() => {
          this.isControlContainerSubmitted$.next(true);
        });
      }
    }
  }

  ngOnInit(): void {
    // Determine whether the control should be displayed as invalid.
    if (this.ngControl?.control?.events) {
      this.shouldIndicateInvalidity$ = rtFormsDefineInvalidityObservable(
        // Define the single event object based on the form control events.
        this.ngControl.control.events.pipe(
          formControlCombinedStatusesAdapter({
            pristine: !!this.ngControl.pristine,
            valid: !!this.ngControl.valid,
            touched: !!this.ngControl.touched,
          }),
        ),
        this.isControlContainerSubmitted$,
        this.errorHandleStrategy,
      );
    }

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
