import {Subscription} from 'rxjs';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-rt-text-input',
  templateUrl: './rt-text-input.component.html',
  styleUrls: ['./rt-text-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RtTextInputComponent),
      multi: true,
    },
  ],
})
export class RtTextInputComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @ViewChild('textInputElement') public textInputElement?: ElementRef<HTMLInputElement>;

  @Input() placeholder: string;

  @Input() inputType = 'text';

  /** Triggered whether the value is changed. Will be overwritten by Angular forms. */
  public onChange?: (value: Nullable<string>) => void;

  /** Triggered whether the control is touched. Will be overwritten by Angular forms. */
  public onTouched?: () => void;

  public readonly textInputControl = new FormControl<string>('');

  /** Component subscriptions. Will be unsubscribed on component destroy. */
  public readonly subscription = new Subscription();

  @HostBinding('class.disabled') protected isDisabled = false;

  constructor(protected renderer: Renderer2) {}

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
