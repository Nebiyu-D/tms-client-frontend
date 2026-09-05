import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-admin-course-create',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './admin-course-create.component.html',
  styleUrl: './admin-course-create.component.scss',
})
export class AdminCourseCreateComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly courseService = inject(CourseService);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');

  readonly form = this.formBuilder.nonNullable.group({
    code: ['', [Validators.required, Validators.pattern(/^[A-Za-z]{3}-\d{3}$/)]],
    title: ['', [Validators.required, Validators.maxLength(200)]],
    maxCapacity: [30, [Validators.required, Validators.min(1), Validators.max(200)]],
  });

  submit(): void {
    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const value = this.form.getRawValue();
    this.courseService.create({
      code: value.code.toUpperCase(),
      title: value.title.trim(),
      maxCapacity: value.maxCapacity,
    }).subscribe({
      next: () => this.router.navigate(['/admin/courses']),
      error: () => {
        this.errorMessage.set('Unable to create the course. Check the course code and try again.');
        this.isSubmitting.set(false);
      },
    });
  }
}