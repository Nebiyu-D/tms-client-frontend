import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Course } from '../../models/course.model';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-admin-course-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-course-list.component.html',
  styleUrl: './admin-course-list.component.scss',
})
export class AdminCourseListComponent {
  private readonly courseService = inject(CourseService);

  readonly courses = signal<Course[]>([]);
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  constructor() {
    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.courseService.getAllForAdmin().subscribe({
      next: (courses) => this.courses.set(courses),
      error: () => this.errorMessage.set('Unable to load courses.'),
      complete: () => this.isLoading.set(false),
    });
  }

  deleteCourse(course: Course): void {
    if (!window.confirm(`Delete ${course.title}?`)) {
      return;
    }

    this.courseService.delete(course.id).subscribe({
      next: () => this.courses.update((courses) => courses.filter((item) => item.id !== course.id)),
      error: () => this.errorMessage.set('Unable to delete the course.'),
    });
  }
}