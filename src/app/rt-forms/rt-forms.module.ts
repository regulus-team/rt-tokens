import {CommonModule, DatePipe} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RtTextInputComponent} from './components/checkbox-in-array/rt-text-input.component';
import {MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';

const formComponents = [RtTextInputComponent];

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormField, MatInput],
  declarations: [formComponents],
  providers: [DatePipe],
  exports: [formComponents],
})
export class RtFormsModule {}
