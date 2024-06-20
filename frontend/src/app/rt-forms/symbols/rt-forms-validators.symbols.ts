import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {isFileTypeAcceptable} from './rt-forms-utils.symbols';

/**
 * Custom validators for reactive forms.
 */
export class RtValidators {
  /**
   * Validator function that checks if the file type is acceptable.
   * Possible error properties:
   * - `invalidFileObject`: The value is not a File object.
   * - `fileType`: The file type is not acceptable.
   *
   * @param allowedTypes - Array of allowed file types.
   */
  static fileTypeValidator(allowedTypes: string[]): ValidatorFn {
    // Return a validator function.
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control?.value;

      // If the value is null or undefined, return null (no error).
      if (value === null || value === undefined) {
        return null;
      }

      // If the value is not a File object, return an error.
      if (!(value instanceof File)) {
        return {invalidFileObject: true};
      }

      // Use the utility function to check the file type.
      if (!isFileTypeAcceptable(value, allowedTypes)) {
        return {fileType: {allowedTypes, actualType: value.type}};
      }

      // If all checks pass, return null (no error).
      return null;
    };
  }
}
