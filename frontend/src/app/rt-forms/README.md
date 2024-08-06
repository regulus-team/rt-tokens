# RT Forms

## About

RT Forms provides a set of form controls and utilities to simplify form creation and validation in Angular applications.

## Usage

### Form controls

Form controls implement `ControlValueAccessor` interface and can be used in any form.
Check the `components` directory for the available form controls and their properties.

```html
<rt-text-input inputType="number" [formControl]="myControl"></rt-text-input>
```

### Form validation

It is recommended to use a `<form>` element to wrap form controls and use `FormGroup` or `FormArray` to manage form controls.
In this case, the form controls will be automatically validated and the form will be marked as invalid if any of the controls is invalid.
Also, it enables the strategy `afterSubmit`, which allows showing validation errors even on untouched controls.

```html
<form [formGroup]="myForm" (submit)="submit()">
  <rt-text-input inputType="number" formControlName="myForm.control.myControl" [validationMessages]="{required: 'This field is required'}"></rt-text-input>
  <button type="submit">Submit</button>
</form>
```


