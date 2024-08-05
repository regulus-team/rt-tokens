import {Pipe, PipeTransform} from '@angular/core';
import {RtValidationErrorHandleStrategy} from '../../symbols/rt-forms-types.symbols';

@Pipe({
  name: 'rtFormsShouldDisplayValidation',
  standalone: true,
})
export class RtFormsShouldDisplayValidationPipe implements PipeTransform {
  constructor() {}

  transform(
    isControlInvalid: Nullable<boolean>,
    isControlDirty: Nullable<boolean>,
    isControlTouched: Nullable<boolean>,
    errorHandleStrategy: RtValidationErrorHandleStrategy,
    isControlContainerSubmitted: Nullable<boolean>,
  ): boolean {
    switch (errorHandleStrategy) {
      // If the error handle strategy is disabled, return false.
      case RtValidationErrorHandleStrategy.disabled:
        return false;

      // If the error handle strategy is instant, return true if the control is invalid.
      case RtValidationErrorHandleStrategy.instant:
        return !!isControlInvalid;

      // If the error handle strategy is afterSubmit, return true if the control is invalid and the control container is submitted.
      case RtValidationErrorHandleStrategy.afterSubmit:
        return !!isControlInvalid && !!(isControlContainerSubmitted || isControlDirty || isControlTouched);
    }
  }
}
