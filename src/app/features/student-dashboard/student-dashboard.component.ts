import { Component, inject, signal, computed } from '@angular/core';
import { CourseCardComponent } from "../../ui/course-card/course-card";
import { Course } from "../../models/course.model";
import { rxResource } from "@angular/core/rxjs-interop";
import { CourseService } from "../../services/course.service";

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CourseCardComponent],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.scss',
})
export class StudentDashboardComponent {
  private api = inject(CourseService);
  studentName = signal("Liya Kebede");
  earnedCredits = signal(45);

  selectedCourse = signal<Course | null>(null);

  

  graduationStatus = computed(() =>
    this.earnedCredits() >= 120 ? "Eligible for Graduation" : "In Progress"
  );

  coursesResource = rxResource({
    stream: () => this.api.getAll(),
  });

  registerForClass() {
    this.earnedCredits.update((c) => c + 3);
  }

  handleEnroll(course: Course) {
    this.selectedCourse.set(course);
    console.log("Enrollment requested for:", course.title);
  }
}
