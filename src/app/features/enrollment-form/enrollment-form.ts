import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';

@Component({
  selector: 'app-enrollment-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './enrollment-form.html',
  styleUrl: './enrollment-form.scss'
})
export class EnrollmentForm {
  private fb = inject(FormBuilder);
  submitted = signal(false);

  // Define form controls using nonNullable formBuilder
  form = this.fb.nonNullable.group({
    studentId: [
      '',
      [Validators.required, Validators.pattern('^STU-[0-9]{4}$')],
    ],
    courseId: ['', Validators.required],
    term: ['Fall 2026', Validators.required],
    notes: [''],
    backupCourses: this.fb.array<FormControl<string>>([]),
  });

  // Getter shortcut for the backupCourses FormArray
  get backups() {
    return this.form.controls.backupCourses;
  }

  // Add dynamic row
  addBackup() {
    this.backups.push(
      this.fb.control('', {
        nonNullable: true,
        validators: Validators.required,
      })
    );
  }

  // Remove dynamic row by index
  removeBackup(index: number) {
    this.backups.removeAt(index);
  }

  // Handle form submission
  submit() {
    if (this.form.valid) {
      // Use getRawValue() to preserve values even if controls are disabled
      const payload = this.form.getRawValue();
      console.log('Enrollment payload:', payload);
      this.submitted.set(true);
    } else {
      // Force all validation errors to render on untouched fields
      this.form.markAllAsTouched();
    }
  }
}