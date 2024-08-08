import {BehaviorSubject, combineLatest, map, Observable} from 'rxjs';
import {AbstractControl, NgControl} from '@angular/forms';
import {RtValidationErrorHandleStrategy} from './rt-forms-types.symbols';
import {FormControlCombinedStatuses} from './rt-forms-control-status-adapter.symbols';

/**
 * Defines whether the validation should be displayed for the control based on the provided strategy.
 */
export const rtFormsDefineInvalidityObservable = (
  controlStatuses$: Observable<FormControlCombinedStatuses>,
  isControlContainerSubmitted$: Observable<boolean>,
  errorHandleStrategy: RtValidationErrorHandleStrategy,
): Observable<boolean> =>
  combineLatest([controlStatuses$, isControlContainerSubmitted$]).pipe(
    map(([controlStatuses, isControlContainerSubmitted]) => {
      switch (errorHandleStrategy) {
        // If the error handle strategy is disabled, return false.
        case RtValidationErrorHandleStrategy.disabled:
          return false;

        // If the error handle strategy is instant, return true if the control is invalid.
        case RtValidationErrorHandleStrategy.instant:
          return !controlStatuses.valid;

        // If the error handle strategy is afterSubmit, return true if the control is invalid and the control container is submitted.
        case RtValidationErrorHandleStrategy.afterSubmit:
          return !controlStatuses.valid && !!(isControlContainerSubmitted || !controlStatuses.pristine || controlStatuses.touched);
      }
    }),
  );

/**
 * Overwrites the reset function of the control to reset the submitted state; emits false to the provided submitted observer.
 *
 * @param ngControl - The control to overwrite the reset function.
 * @param isControlSubmitted$ - The observer to emit the submitted state; used in the inputs for highlighting the validation.
 */
export const rtFormsOverwriteNgControlResetFunction = (ngControl: NgControl, isControlSubmitted$: BehaviorSubject<boolean>): void => {
  // Extract the control from the wrapped ngControl.
  const control = ngControl.control;

  // If the control exists, overwrite the reset function.
  if (control) {
    // Save the base reset function.
    const baseResetFunction = control.reset.bind(control);

    // Define the new reset function using the base reset function with the additional logic to reset the submitted state.
    control.reset = (...args: ArgumentsType<AbstractControl['reset']>) => {
      baseResetFunction(...args);

      // Ensure that the observer is not closed and emit false to reset the submitted state.
      if (isControlSubmitted$ && !isControlSubmitted$.closed) {
        isControlSubmitted$.next(false);
      }
    };
  }
};
