import {combineLatest, map, Observable} from 'rxjs';
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
