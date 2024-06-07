import {Observable, Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';
import {ChangeDetectorRef, Directive, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormGroup, UntypedFormBuilder} from '@angular/forms';
import {Store} from '@ngxs/store';
import {
  RtFormErrorMessages,
  RtFormFields,
  RtFormLabels,
  RtServerError,
  RtValidationMessages,
  TransformToTypedForm,
} from './symbols/rt-forms-types.symbols';
import {ErrorFromBackend, UnknownError} from '../shared/symbols/errors.symbols';

@Directive()
export abstract class RtFormValidationComponent<T> implements OnInit, OnDestroy {
  /** Main form that stores all statuses and data. */
  public form: FormGroup<TransformToTypedForm<T>>;

  /** Contain actual errors for each field. */
  public actualErrorMessages: RtFormErrorMessages<Partial<T>>;

  /** Suppose to be provided stream with last backend error. */
  protected backendErrors$: Observable<UnknownError>;

  /** Contain labels for each form control. */
  protected labels: RtFormLabels<Partial<T>>;

  /** Contain error labels for each possible control error. */
  protected validationMessages: RtValidationMessages<Partial<T>>;

  /** Contain fields description (relation between key abd its validators). */
  protected formFields: RtFormFields<Partial<T>>;

  /** Component subscriptions. Will be unsubscribed on component destroy. */
  protected subscription: Subscription = new Subscription();

  /** Contain server errors received after form submitting. */
  protected serverErrors: RtServerError<T>[] = [];

  protected constructor(
    protected fb: UntypedFormBuilder,
    protected cd: ChangeDetectorRef,
    protected store: Store,
  ) {}

  ngOnInit(shouldInitForm = true): void {
    // Init form if it is required.
    // Otherwise, it should be initialized in child component (added for cases when manual init required).
    if (shouldInitForm) {
      this.form = this.initializeFormGroup(this.formFields);
    }

    // Generate errors object for it using provided fields.
    this.actualErrorMessages = this.initializeFormErrorsDict(this.formFields);

    // Update validation messages on each value changes.
    this.subscription.add(this.form?.valueChanges.subscribe(() => this.updateActualErrors()));

    // Subscribe to backend error. Trigger handler on each error.
    if (this.backendErrors$) {
      this.subscription.add(
        this.backendErrors$.pipe(filter(error => !!error)).subscribe(error => {
          this.onSubmitFail(error);
        }),
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Check each form field, if it has any error => set correct validation message; otherwise, reset message.
   */
  protected updateActualErrors(formSubmitted = false): void {
    // Reset all form errors.
    this.actualErrorMessages = this.initializeFormErrorsDict(this.formFields);

    for (const field of Object.keys(this.formFields)) {
      // Check if control with this key exist.
      const control = this.form.get(field);
      if (!control) {
        continue;
      }

      // If control contain error triggered by frontend validation => assign message.
      if (this.isControlHasErrors(control)) {
        const messages = this.validationMessages?.[field as keyof RtValidationMessages<Partial<T>>];
        for (const key in control.errors) {
          if (key) {
            this.actualErrorMessages[field as keyof RtFormErrorMessages<Partial<T>>] += this.makeMessage(messages, control, field, key);
            break;
          }
        }
        // Check if such server error exist. If yes => assign validation message provided by backend.
      } else {
        const serverError = this.extractServerError(control);
        if (serverError) {
          this.actualErrorMessages[field as keyof RtFormErrorMessages<Partial<T>>] = serverError;
          if (formSubmitted && control.untouched) {
            control.markAsTouched({onlySelf: true});
            control.setErrors({backend: serverError});
          }
        }
      }
    }
  }

  /**
   * Empty server error list.
   */
  protected removeServerErrors(): void {
    this.serverErrors = [];
  }

  /**
   * Remove server errors related to the provided control.
   */
  protected excludeControlServerErrors(control: AbstractControl): void {
    this.serverErrors = this.serverErrors.filter(errorData => errorData.control !== control);
  }

  /**
   * Update form actual errors messages if form not valid.
   */
  protected submitForm(): void {
    if (!this.form.valid) {
      this.updateActualErrors(true);
    }
  }

  /**
   * Mark that control has errors if it is not valid and is enabled.
   */
  protected isControlHasErrors(control: AbstractControl): boolean {
    return control && control.enabled && !control.valid;
  }

  /**
   * Extract text message for specific control.
   */
  protected makeMessage(messages: Record<string, string>, control: AbstractControl, field: string, key: string): string {
    let message;
    if (messages && key in messages) {
      message = messages[key];
      if (message.indexOf('%label') >= 0 && this.labels[field as keyof RtFormLabels<Partial<T>>]) {
        let label = this.labels[field as keyof RtFormLabels<Partial<T>>];
        if (label.endsWith('*')) {
          label = label.replace(/\*$/, '');
        }
        message = message.replace('%label', label);
      }
    } else if (typeof control?.errors?.[key] === 'string') {
      message = control.errors[key];
    } else {
      message = key;
    }
    return message;
  }

  /**
   * Extract key to message relation from backend error.
   */
  protected getBackendErrors(response: UnknownError): Nullable<Record<string, string>> {
    if (!response || !response.error || typeof response.error !== 'object') {
      return null;
    }
    let errors = {};
    for (const field of Object.keys(response.error)) {
      const messages = response.error[field as keyof ErrorFromBackend];
      if (!messages || !messages.length) {
        continue;
      }

      errors = {
        ...errors,
        [field]: messages[0],
      };
    }
    return errors;
  }

  /**
   * Extract backend errors and store them in local variable, then update validation messages.
   */
  protected onSubmitFail(error: UnknownError): void {
    const errors = this.getBackendErrors(error);
    if (errors) {
      const validationErrors: RtServerError<T>[] = [];
      for (const field of Object.keys(errors)) {
        // `non_field_errors` contain errors related to the whole form, not to its field.
        if (field !== 'non_field_errors') {
          const message = errors[field];
          const control = this.form.get(field);
          if (control) {
            validationErrors.push({controlName: field as keyof T, control, error: message} as RtServerError<T>);
            control.markAsUntouched({onlySelf: true});
          }
        }
      }
      this.serverErrors = validationErrors;
      this.updateActualErrors(true);
    }
    this.cd.markForCheck();
  }

  /**
   * Generate form errors using provided fields data.
   */
  protected initializeFormErrorsDict(formFields: RtFormFields<Partial<T>>): RtFormErrorMessages<Partial<T>> {
    let formErrors = {};
    for (const name of Object.keys(formFields)) {
      formErrors = {
        ...formErrors,
        [name]: '',
      };
    }
    return formErrors as RtFormErrorMessages<Partial<T>>;
  }

  /**
   * Generate form group using provided fields data.
   */
  protected initializeFormGroup(formFields: RtFormFields<Partial<T>>): FormGroup<TransformToTypedForm<T>> {
    let model = {};
    for (const name of Object.keys(formFields)) {
      if (formFields[name as keyof RtFormFields<Partial<T>>]) {
        model = {
          ...model,
          name: ['', formFields[name as keyof RtFormFields<Partial<T>>]],
        };
      } else {
        model = {
          ...model,
          name: '',
        };
      }
    }
    return this.fb.group(model);
  }

  /**
   * Extract error if it exists in the server errors list & in the control.
   */
  protected extractServerError(control: AbstractControl): Nullable<string> {
    const error = this.serverErrors.filter(serverError => serverError.control === control);
    if (error.length) {
      return error[0].error;
    }
    return null;
  }
}
