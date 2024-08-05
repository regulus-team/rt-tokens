import {Pipe, PipeTransform} from '@angular/core';

/**
 * Extracts the first error message from the validation messages.
 */
@Pipe({
  name: 'rtFormsDefineErrorMessage',
  standalone: true,
})
export class RtFormsDefineErrorMessagePipe implements PipeTransform {
  constructor() {}

  transform(validationMessages: Nullable<{[key: string]: string}>, formErrors: Nullable<{[key: string]: string}>): Nullable<string> {
    // Return null if no validation messages or form errors are provided.
    if (!validationMessages || !formErrors) {
      return null;
    }

    // Extract the list of error keys.
    const errorKeyList = Object.keys(formErrors);

    // Return null if no errors are found.
    if (!errorKeyList.length) {
      return null;
    }

    // Return the first error message from the validation messages.
    for (const errorKey of errorKeyList) {
      if (validationMessages[errorKey]) {
        return validationMessages[errorKey];
      }
    }

    // Return the first error key if no error message is found.
    return errorKeyList[0];
  }
}
