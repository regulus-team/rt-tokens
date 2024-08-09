import {FormArray, FormGroup} from '@angular/forms';

/** Describes a type for form labels. Labels will be used in HTML template. */
export type RtFormLabels<T> = {
  [P in keyof T]: string;
};

/**
 * Transform FormGroup or FormArray to RtFormLabels type.
 */
export type RtFormLabelsFromForm<T extends FormGroup | FormArray> = RtFormLabels<T['controls']>;

/** Describes a type for form placeholders. Placeholders will be used in HTML template. */
export type RtFormPlaceholders<T> = {
  [P in keyof T]: string;
};

/**
 * Transform FormGroup or FormArray to RtFormLabels type.
 */
export type RtFormPlaceholdersFromForm<T extends FormGroup | FormArray> = RtFormPlaceholders<T['controls']>;

/**
 * Describes a type for validation messages.
 * The first key describes control name, each key inside it describes validator name.
 * If control is not valid, provided string will be displayed as the error message.
 */
export type RtValidationMessages<T> = {
  [P in keyof T]: {[key: string]: string};
};

/**
 * Transform FormGroup or FormArray to RtValidationMessages type.
 */
export type RtValidationMessagesFromForm<T extends FormGroup | FormArray> = RtValidationMessages<T['controls']>;

/**
 * Options model for choice. Set up relation between id and its view value.
 * T is a unique identifier on the backend for specific choice.
 * V is view value for this specific choice (what should be displayed for user).
 */
export type RtChoice<T, V> = [T, V];

/**
 * Describes possible strategies for handling validation errors.
 */
export enum RtValidationErrorHandleStrategy {
  /**
   * Show an error message only after the user has left the field or submitted the form.
   */
  afterLeft = 'afterLeft',

  /**
   * Disable the error messages completely.
   */
  disabled = 'disabled',

  /**
   * Instantly show an error message once they occur.
   * This will highlight the field with an error message as soon as it is invalid.
   */
  instant = 'instant',

  /**
   * Show an error message only after the user has interacted with the field or submitted the form.
   */
  afterEdit = 'afterEdit',
}
