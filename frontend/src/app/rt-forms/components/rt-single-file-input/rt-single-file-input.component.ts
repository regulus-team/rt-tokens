import {from, map, Observable, of, startWith, Subscription, switchMap} from 'rxjs';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {ControlValueAccessor, FormControl, NgControl} from '@angular/forms';
import {isFileTypeAcceptable} from '../../symbols/rt-forms-utils.symbols';

/**
 * Describes a file metadata used for generating a preview.
 */
interface FilePreview {
  /** Base64 encoded file content (present only if submitted file is image). */
  src: string;

  /** File type. */
  type: string;

  /** File name. */
  name: string;

  /** File extension. */
  extension: string;

  /** Indicates whether the file is an image. */
  isImage: boolean;
}

@Component({
  selector: 'rt-single-file-input',
  templateUrl: './rt-single-file-input.component.html',
  styleUrls: ['./rt-single-file-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // No providers here, as the `NG_VALUE_ACCESSOR` provider is assigned manually in the abstract class constructor.
})
export class RtSingleFileInputComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @ViewChild('dragAndDropArea') public dragAndDropArea?: ElementRef<HTMLDivElement>;

  /** Label for the drop area. */
  @Input() dropFileLabel: string;

  /** Label for the action button. */
  @Input() actionButtonLabel: string;

  /** Type of the input field. */
  @Input() inputType = 'text';

  /** Error message to be displayed. */
  @Input() errorMessage: Nullable<string | undefined>;

  /** Observable with the preview of the currently selected file. */
  public filePreview$: Observable<Nullable<FilePreview>>;

  /**
   * Child elements also trigger leave and enter events.
   * Increase counter on each entering and decrease on each leave, so if counter > 0 => element is over droppable area.
   */
  public enterAndLeaveDifference = 0;

  /** Triggered whether the value is changed. Will be overwritten by Angular forms. */
  public onChange?: (value: Nullable<File>) => void;

  /** Triggered whether the control is touched. Will be overwritten by Angular forms. */
  public onTouched?: () => void;

  /** Form control for the single file input. */
  public readonly singleFileInputControl = new FormControl<Nullable<File>>(null);

  /** Observable with the current value of the single file input. */
  public readonly singleFileInputCurrentValue$: Observable<Nullable<File>> = this.singleFileInputControl.valueChanges.pipe(
    startWith(this.singleFileInputControl.value),
  );

  /** Component subscriptions. Will be unsubscribed on component destroy. */
  public readonly subscription = new Subscription();

  /** List of acceptable file types as a string. */
  public acceptableFileTypesString = '';

  /** List of acceptable file types. */
  protected acceptableFileTypesList: string[] = [];

  /** Indicates whether the hovered file is valid. */
  public isLastDroppedFileValid = true;

  @HostBinding('class.disabled') protected isDisabled = false;

  constructor(
    private ngZone: NgZone,
    protected renderer: Renderer2,
    public ngControl: NgControl,
  ) {
    // Use the `ngControl` to access the related form control.
    // The `NG_VALUE_ACCESSOR` provider was removed from the component, as it is assigned here directly.
    ngControl.valueAccessor = this;
  }

  /**
   * Getter for the acceptable file types.
   */
  get acceptableFileTypes(): string[] {
    return this.acceptableFileTypesList;
  }

  /**
   * Array of acceptable file types.
   * If not provided, all file types are accepted.
   */
  @Input() set acceptableFileTypes(acceptableFileTypes: string[]) {
    this.acceptableFileTypesList = acceptableFileTypes;
    this.acceptableFileTypesString = acceptableFileTypes.join(', ');
  }

  ngOnInit(): void {
    // Generate a preview for the currently selected file.
    this.filePreview$ = this.singleFileInputControl.valueChanges.pipe(
      switchMap(file => {
        // Reset preview if a broken file is selected.
        if (!(file instanceof File)) {
          return of(null);
        }

        // Generate a preview for the selected file.
        return this.createPreview(file);
      }),
    );

    // Update the form control value on each change.
    this.subscription.add(
      this.singleFileInputControl.valueChanges.subscribe(value => {
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
  public writeValue(value: File): void {
    // Update the input value.
    this.singleFileInputControl.setValue(value, {emitEvent: false});
  }

  /**
   * Required by ControlValueAccessor.
   * Describes what actions should be taken when the control status changes.
   */
  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    if (this.dragAndDropArea) {
      this.renderer.setProperty(this.dragAndDropArea.nativeElement, 'disabled', isDisabled);
    }
  }

  /**
   * Update the local file control value with the provided file.
   * @param file - File to update the control with.
   */
  public safeLocalControlUpdate(file: File): void {
    // Update the control only if the file type is acceptable.
    // Do not invoke control validation logic here, as it should be handled by the form control validators.
    this.isLastDroppedFileValid = this.isFileTypeAcceptable(file);
    if (this.isLastDroppedFileValid) {
      this.singleFileInputControl.setValue(file);
    }
  }

  /**
   * Mark the input as invalid if the dragged file is not acceptable.
   */
  public elementEnteredDroppableArea(event: DragEvent): void {
    // Prevent the browser from opening the file.
    event.preventDefault();
    this.enterAndLeaveDifference++;
  }

  /**
   * Update counter on each "left" event.
   */
  public elementLeftDroppableArea(event: DragEvent): void {
    // Prevent the browser from opening the file.
    event.preventDefault();
    this.enterAndLeaveDifference--;
  }

  /**
   * Update the local file control value with the dropped file.
   */
  public elementDropped(event: DragEvent): void {
    // Prevent the browser from opening the file.
    event.preventDefault();
    if (event?.dataTransfer && event?.dataTransfer?.files?.length > 0) {
      // Extract the file from the event.
      const file = event.dataTransfer.files[0];

      // Set the value of the control to the dropped file.
      this.safeLocalControlUpdate(file);
    }

    // Reset the counter as the element is no longer over the droppable area.
    this.enterAndLeaveDifference = 0;
  }

  /**
   * Update the local file control value with the selected file.
   */
  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input?.files?.[0]) {
      // Extract the file from the input.
      const file = input.files[0];

      // Set the value of the control to the selected file.
      this.safeLocalControlUpdate(file);
    }
  }

  /**
   * Create a preview for the provided file.
   * @param file - File to create a preview for.
   * @returns Observable with the preview of the provided file.
   */
  public createPreview(file: File): Observable<FilePreview> {
    // Create a base preview object with directly available file metadata.
    const basePreview: FilePreview = {
      src: '',
      isImage: false,
      type: file.type,
      name: file.name,
      extension: file.name.split('.').pop()?.toUpperCase() || 'FILE',
    };

    // If the file is not an image, return the base preview.
    if (!file.type.startsWith('image')) {
      return of(basePreview);
    }

    // Otherwise, try to read the file as an image and return the preview.
    return from(
      new Promise<string>(resolve => {
        // Read the file as a data URL.
        const reader = new FileReader();
        reader.onload = (e: any) => {
          // Wrap the result in the Angular zone to trigger change detection.
          this.ngZone.run(() => resolve(e.target.result));
        };
        reader.readAsDataURL(file);
      }),
    ).pipe(
      // Update the preview with the base64 encoded image.
      map(base64String => ({
        ...basePreview,
        isImage: true,
        src: base64String,
      })),
    );
  }

  /**
   * Reset the file input.
   */
  public resetFileInput(): void {
    this.singleFileInputControl.reset();
  }

  /**
   * Check if the file type is acceptable.
   * @param file - File to check.
   */
  protected isFileTypeAcceptable(file: File): boolean {
    // Use utility function to check if the file type is acceptable.
    return isFileTypeAcceptable(file, this.acceptableFileTypesList);
  }
}
