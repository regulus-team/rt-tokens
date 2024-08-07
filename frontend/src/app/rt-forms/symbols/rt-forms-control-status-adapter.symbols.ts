import {distinctUntilChanged, map, OperatorFunction, pipe, scan, startWith} from 'rxjs';
import {ControlEvent} from '@angular/forms';

/**
 * Possible fields of the original form control event change.
 */
export interface FormControlOriginalEvent {
  /** The control has not been changed. */
  pristine?: boolean;

  /** The control value validity. */
  status?: 'VALID' | 'INVALID';

  /** The control has been touched. */
  touched?: boolean;
}

/**
 * Merged statuses of a form control into the single object.
 */
export interface FormControlCombinedStatuses {
  /** The control has not been changed. */
  pristine: boolean;

  /** The control has been changed. */
  valid: boolean;

  /** The control has been touched. */
  touched: boolean;
}

/**
 * Default combined statuses for a form control.
 */
export const defaultFormControlCombinedStatuses: FormControlCombinedStatuses = {
  pristine: true,
  valid: true,
  touched: false,
};

/**
 * Custom RxJs operator.
 * Transform different status events of the form control into the single object.
 */
export const formControlCombinedStatusesAdapter = (
  startValue: FormControlCombinedStatuses,
): OperatorFunction<ControlEvent, FormControlCombinedStatuses> =>
  pipe(
    // Cast the event to the Partial<FormControlCombinedStatuses> type as there is no way to cast it to the exact type.
    map(event => event as unknown as Partial<FormControlCombinedStatuses>),

    // Start with the provided value for cases when the form control is not changed yet.
    // The events emitter is based on Subject, so otherwise the first event will be missed.
    startWith({...startValue}),

    // Merge all statuses into the single object; overwrite the previous values.
    scan((acc: Partial<FormControlCombinedStatuses>, event: FormControlOriginalEvent): FormControlCombinedStatuses => {
      // Merge the default statuses with the stored ones to ensure type safety.
      const safeAccumulator: FormControlCombinedStatuses = {...defaultFormControlCombinedStatuses, ...acc};

      // Each event can contain only one status, so we can return it instantly once found.

      // Check the event for the `pristine` status.
      if (Object.getOwnPropertyDescriptor(event, 'pristine') && typeof event.pristine === 'boolean') {
        return {
          ...safeAccumulator,
          pristine: event.pristine,
        };
      }

      // Check the event for the `valid` status.
      if (Object.getOwnPropertyDescriptor(event, 'status') && typeof event.status === 'string') {
        return {
          ...safeAccumulator,
          valid: event.status === 'VALID',
        };
      }

      // Check the event for the `touched` status.
      if (Object.getOwnPropertyDescriptor(event, 'touched') && typeof event.touched === 'boolean') {
        return {
          ...safeAccumulator,
          touched: event.touched,
        };
      }

      // Return the accumulator if no status was found (value changes are also considered as event, but we have no interest in them).
      return safeAccumulator;
      // We are using safe accumulator, so we always sure that the result contains all fields.
    }) as OperatorFunction<FormControlOriginalEvent, FormControlCombinedStatuses>,

    // Do not emit the same statuses.
    distinctUntilChanged((prev, curr) => prev.pristine === curr.pristine && prev.valid === curr.valid && prev.touched === curr.touched),
  );
