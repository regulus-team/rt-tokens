import {CommonModule, DatePipe, NgOptimizedImage} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatError, MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {RtTextInputComponent} from './components/rt-text-input/rt-text-input.component';
import {RtSingleFileInputComponent} from './components/rt-single-file-input/rt-single-file-input.component';
import {MatButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';

const formComponents = [RtTextInputComponent, RtSingleFileInputComponent];

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormField, MatInput, MatError, MatButton, NgOptimizedImage, MatTooltip],
  declarations: [formComponents],
  providers: [DatePipe],
  exports: [formComponents],
})
export class RtFormsModule {}
