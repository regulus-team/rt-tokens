# RT Forms

## About

Forms usually contain two main parts: the form instance and the form controls.
Base implementation for the typed forms and validation is provided by the `RtFormValidationComponent` component.
Form controls are implemented as separate components and can be used in any form (stored in `components` directory).

## Usage

### Form instance

To create a form instance, you need to extend the `RtFormValidationComponent` class and define the form controls.
The form instance will be created during `super.ngOnInit()` call based on `formFields` properties.

```typescript
import {Observable} from 'rxjs';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {Select, Store} from '@ngxs/store';
import {AuthState} from '../state/auth.state';
import {LoginWithEmailAndPassword} from '../state/auth.actions';
import {markAsTouchedRecursive} from '../../rt-forms/utils/functions';
import {RtFormFields, RtFormLabels, RtValidationMessages} from '../../rt-forms/symbols';
import {MessagesState} from '../../messages/messages.state';
import {RtFormValidationComponent} from '../../rt-forms/rt-form-validation.component';
import {Settings} from '../../../conf/settings';

/** Contain local login form fields. */
interface LocalLoginForm {
  /** Username used for authorization. */
  username: string;

  /** User email used for authorization. */
  email: string;

  /** User password related to email or username. */
  password: string;

  /** Should user session be remembered. */
  remember_me: boolean;
}

@Component()
export abstract class AbstractLoginComponent extends RtFormValidationComponent<LocalLoginForm> implements OnInit {
  public readonly isAuthenticated$ = this.store.select(AuthState.isAuthenticated);
  public readonly loading$ = this.store.select(AuthState.isLoading);
  public readonly backendErrors$ = this.store.select(MessagesState.backendError);

  public labels: RtFormLabels<LocalLoginForm> = {
    email: $localize`Email`,
    password: $localize`Password`,
    remember_me: $localize`Remember me`,
  };

  public formFields: RtFormFields<LocalLoginForm> = {
    email: [Validators.required, Validators.email, Validators.maxLength(200)],
    password: [Validators.required, Validators.maxLength(200), Validators.minLength(8)],
    remember_me: [],
  };

  validationMessages: RtValidationMessages<LocalLoginForm> = {
    email: {
      required: `Enter Email`,
      email: `Email is not valid`,
      maxlength: `Email should not be more than 200 characters`,
    },
    password: {
      required: `Minimum 8 characters required`,
      maxlength: `Password should not be more than 200 characters`,
      minlength: 'Minimum 8 characters required',
    },
    remember_me: {},
  };

  protected constructor(
    protected fb: UntypedFormBuilder,
    protected cd: ChangeDetectorRef,
    protected store: Store,
    protected settings: Settings,
  ) {
    super(fb, cd, store);
  }

  public querySelector(): any {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.store.dispatch(new LoginWithEmailAndPassword(this.form.value));
    } else {
      markAsTouchedRecursive(this.form);
      super.submitForm();
    }
  }
}
```

### Form controls

Form controls implement `ControlValueAccessor` interface and can be used in any form.
Check the `components` directory for the available form controls and their properties.

```html
<rt-text-input inputType="number" [formControl]="myControl"></rt-text-input>
```



