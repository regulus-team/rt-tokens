import {Observable} from 'rxjs';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {MatError} from '@angular/material/form-field';
import {AsyncPipe} from '@angular/common';
import {RtValidationErrorHandleStrategy} from '../../symbols/rt-forms-types.symbols';
import {RtFormsShouldDisplayValidationPipe} from '../../pipes/rt-forms-should-display-validation/rt-forms-should-display-validation';
import {FormControlCombinedStatuses} from '../../symbols/rt-forms-control-status-adapter.symbols';

@Component({
  selector: 'rt-validation',
  templateUrl: './rt-validation.component.html',
  styleUrls: ['./rt-validation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatError, RtFormsShouldDisplayValidationPipe, AsyncPipe],
})
export class RtValidationComponent {
  /** Error handle strategy. */
  @Input() errorHandleStrategy: RtValidationErrorHandleStrategy = RtValidationErrorHandleStrategy.afterSubmit;

  /** Relation between the error name imposed by Validators and the error message. */
  @Input() validationMessage: Nullable<string>;

  /** Indicates whether the control container (like [formGroup]) has been submitted. */
  @Input() isControlContainerSubmitted: Nullable<boolean>;

  /** Observable that emits the statuses of the control. */
  @Input() controlStatuses$: Observable<FormControlCombinedStatuses>;
}
