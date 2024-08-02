import {ComponentFixture, TestBed} from '@angular/core/testing';
import {SharedConfirmDialogComponent} from './shared-confirm-dialog.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

describe('ConfirmDialogComponent', () => {
  let component: SharedConfirmDialogComponent;
  let fixture: ComponentFixture<SharedConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SharedConfirmDialogComponent],
      providers: [
        {provide: MAT_DIALOG_DATA, useValue: {title: 'title'}},
        {provide: MatDialogRef, useValue: null},
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
