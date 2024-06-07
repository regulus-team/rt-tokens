import {UntypedFormArray, UntypedFormGroup} from '@angular/forms';

export const updateValueAndValidityRecursive = (form: UntypedFormGroup | UntypedFormArray, emitEvent = false): void => {
  if (!form.controls) {
    form.updateValueAndValidity({emitEvent});
    return;
  }

  if (Array.isArray(form.controls)) {
    form.controls.forEach(ctrl => updateValueAndValidityRecursive(ctrl as UntypedFormArray, emitEvent));
    return;
  }

  // @ts-expect-error: It is always FormGroup, as check for FormArray was above.
  Object.keys(form.controls).forEach(name => updateValueAndValidityRecursive(form.controls[name], emitEvent));
};

export const markAsTouchedRecursive = (form: UntypedFormGroup | UntypedFormArray): void => {
  if (!form.controls) {
    form.markAsTouched();
    if (!form.dirty) {
      form.markAsDirty();
    }
    return;
  }

  if (Array.isArray(form.controls)) {
    form.controls.forEach(ctrl => markAsTouchedRecursive(ctrl as UntypedFormArray));
    return;
  }

  // @ts-expect-error: It is always FormGroup, as check for FormArray was above.
  Object.keys(form.controls).forEach(name => markAsTouchedRecursive(form.controls[name]));
};

export const markAsUntouchedRecursive = (form: UntypedFormGroup | UntypedFormArray): void => {
  if (!form.controls) {
    form.markAsUntouched();
    if (!form.pristine) {
      form.markAsPristine();
    }
    return;
  }

  if (Array.isArray(form.controls)) {
    form.controls.forEach(ctrl => markAsUntouchedRecursive(ctrl as UntypedFormArray));
    return;
  }

  // @ts-expect-error: It is always FormGroup, as check for FormArray was above.
  Object.keys(form.controls).forEach(name => markAsUntouchedRecursive(form.controls[name]));
};
