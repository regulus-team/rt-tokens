import {AbstractControl, ValidatorFn} from '@angular/forms';

/** Describes a type for form errors. Errors will be used for assigning error messages. */
export type RtFormErrorMessages<T> = {
  [P in keyof T]: string;
};

/** Describes a type for form labels. Labels will be used in html template. */
export type RtFormLabels<T> = {
  [P in keyof T]: string;
};

/** Describes a type for form placeholders. Placeholders will be used in html template. */
export type RtFormPlaceholders<T> = {
  [P in keyof T]: string;
};

/** Describes a type for form validators. Each key will create control with validators provided to it. */
export type RtFormFields<T> = {
  [P in keyof T]: ValidatorFn | ValidatorFn[];
};

/**
 * Describes a type for validation messages.
 * The first key describes control name, each key inside it describes validator name.
 * If control is not valid, provided string will be displayed as the error message.
 */
export type RtValidationMessages<T> = {
  [P in keyof T]: {[key: string]: string};
};

/**
 * Options model for choice. Set up relation between id and its view value.
 * T is a unique identifier on the backend for specific choice.
 * V is view value for this specific choice (what should be displayed for user).
 */
export type RtChoice<T, V> = [T, V];

/**
 * Options for rt choice expand group.
 */
export type RtChoiceExpandGroup<T, V> = {title: T; choice: V[]; expand: boolean};

/**
 * Transform the provided type to type with the same fields changed to strings.
 * Supposed to be used for extract control names from its type.
 */
export type RtControlNames<T> = {
  [K in keyof T]: K;
};

/**
 * Describes server error item model.
 */
export interface RtServerError<T> {
  /** Contain name of the control. */
  controlName: keyof T;

  /** Contain form field name. */
  control: AbstractControl<keyof T>;

  /** Contain the related error message. */
  error: string;
}

/**
 * Transform simple interface to typed form (wrap each value with `AbstractControl`).
 */
export type TransformToTypedForm<T> = {
  [K in keyof T]: AbstractControl<T[K]>;
};
