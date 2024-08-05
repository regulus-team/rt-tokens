import {CommonModule, DatePipe, NgOptimizedImage} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatError, MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {RtSingleFileInputComponent} from './components/rt-single-file-input/rt-single-file-input.component';
import {MatButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';

const declarationsToExport = [RtSingleFileInputComponent];

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormField, MatInput, MatError, MatButton, NgOptimizedImage, MatTooltip],
  declarations: [declarationsToExport],
  providers: [DatePipe],
  exports: [declarationsToExport],
})
export class RtFormsModule {}
