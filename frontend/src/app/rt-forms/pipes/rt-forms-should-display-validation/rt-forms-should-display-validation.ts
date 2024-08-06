import {Pipe, PipeTransform} from '@angular/core';
import {RtValidationErrorHandleStrategy} from '../../symbols/rt-forms-types.symbols';
import {FormControlCombinedStatuses} from '../../symbols/rt-forms-control-status-adapter.symbols';

/**
 * Defines whether the validation should be displayed for the control based on the provided strategy.
 */
@Pipe({
  name: 'rtFormsShouldDisplayValidation',
  standalone: true,
})
export class RtFormsShouldDisplayValidationPipe implements PipeTransform {
  constructor() {}

  transform(
    isControlValid: Nullable<FormControlCombinedStatuses['valid']>,
    isControlPristine: Nullable<FormControlCombinedStatuses['pristine']>,
    isControlTouched: Nullable<FormControlCombinedStatuses['touched']>,
    errorHandleStrategy: RtValidationErrorHandleStrategy,
    isControlContainerSubmitted: Nullable<boolean>,
  ): boolean {
    switch (errorHandleStrategy) {
      // If the error handle strategy is disabled, return false.
      case RtValidationErrorHandleStrategy.disabled:
        return false;

      // If the error handle strategy is instant, return true if the control is invalid.
      case RtValidationErrorHandleStrategy.instant:
        return !isControlValid;

      // If the error handle strategy is afterSubmit, return true if the control is invalid and the control container is submitted.
      case RtValidationErrorHandleStrategy.afterSubmit:
        return !isControlValid && !!(isControlContainerSubmitted || !isControlPristine || isControlTouched);
    }
  }
}
