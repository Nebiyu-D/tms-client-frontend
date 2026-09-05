import { Component, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  FormBuilder,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { Router } from '@angular/router';
import { EnrollmentService } from '../../services/enrollment.service';

@Component({
  selector: 'app-enrollment-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './enrollment-form.html',
  styleUrl: './enrollment-form.scss'
})
export class EnrollmentForm {
  private fb = inject(FormBuilder);
  private enrollmentService = inject(EnrollmentService);
  private router = inject(Router);
  submitted = signal(false);
  errorMessage = signal('');
  isSubmitting = signal(false);

  // Define form controls using nonNullable formBuilder
  form = this.fb.nonNullable.group({
    registrationNumber: [
      '',
      [Validators.required, Validators.pattern('^TMS-[0-9]{4}-[0-9]{4}$')],
    ],
    courseId: [0, [Validators.required, Validators.min(1)]],
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
  async submit(): Promise<void> {
    if (!this.form.valid || this.isSubmitting()) {
      // Force all validation errors to render on untouched fields
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    try {
      const { registrationNumber, courseId } = this.form.getRawValue();
      await firstValueFrom(this.enrollmentService.enroll({ registrationNumber, courseId }));
      this.submitted.set(true);
      await this.router.navigate(['/enrollments']);
    } catch (error: any) {
      this.errorMessage.set(error?.error?.detail ?? 'Enrollment could not be submitted.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}