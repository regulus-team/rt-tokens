import {Subscription} from 'rxjs';
import {ChangeDetectionStrategy, Component, ElementRef, HostBinding, Input, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ControlValueAccessor, FormControl, NgControl} from '@angular/forms';

@Component({
  selector: 'app-rt-text-input',
  templateUrl: './rt-text-input.component.html',
  styleUrls: ['./rt-text-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // No providers here, as the `NG_VALUE_ACCESSOR` provider is assigned manually in the abstract class constructor.
})
export class RtTextInputComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @ViewChild('textInputElement') public textInputElement?: ElementRef<HTMLInputElement>;

  /** Placeholder for the input field. */
  @Input() placeholder: Nullable<string | undefined>;

  /** Type of the input field. */
  @Input() inputType = 'text';

  /** Error message to be displayed. */
  @Input() errorMessage: Nullable<string | undefined>;

  /** Triggered whether the value is changed. Will be overwritten by Angular forms. */
  public onChange?: (value: Nullable<string>) => void;

  /** Triggered whether the control is touched. Will be overwritten by Angular forms. */
  public onTouched?: () => void;

  public readonly textInputControl = new FormControl<string>('');

  /** Component subscriptions. Will be unsubscribed on component destroy. */
  public readonly subscription = new Subscription();

  @HostBinding('class.disabled') protected isDisabled = false;

  constructor(
    protected renderer: Renderer2,
    public ngControl: NgControl,
  ) {
    // Use the `ngControl` to access the related form control.
    // The `NG_VALUE_ACCESSOR` provider was removed from the component, as it is assigned here directly.
    ngControl.valueAccessor = this;
  }

  ngOnInit(): void {
    this.subscription.add(
      this.textInputControl.valueChanges.subscribe(value => {
        if (this.onChange) {
          this.onChange(value);
        }

        if (this.onTouched) {
          this.onTouched();
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Required by ControlValueAccessor.
   * Function for overriding the `onChange` class method.
   */
  public registerOnChange(fn: (value: any) => void): void {
    // Override the class method with provided function.
    this.onChange = fn;
  }

  /**
   * Required by ControlValueAccessor.
   * Function for overriding the `onTouched` class method.
   */
  public registerOnTouched(fn: () => void): void {
    // Override the class method with provided function.
    this.onTouched = fn;
  }

  /**
   * Required by ControlValueAccessor.
   * Describes how to update the form model when the value changes.
   */
  public writeValue(value: unknown): void {
    // Convert the value to a string.
    const safeValue = typeof value === 'string' ? value : value?.toString() || '';

    // Update the input value.
    this.textInputControl.setValue(safeValue, {emitEvent: false});
  }

  /**
   * Required by ControlValueAccessor.
   * Describes what actions should be taken when the control status changes.
   */
  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    if (this.textInputElement) {
      this.renderer.setProperty(this.textInputElement.nativeElement, 'disabled', isDisabled);
    }
  }
}
