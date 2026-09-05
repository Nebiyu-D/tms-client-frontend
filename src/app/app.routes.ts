import { Routes } from '@angular/router';
import { roleGuard } from './guards/role.guards';
//import { AdminCourseListComponent } from './features/admin-course-list/admin-course-list.component';


// we used lazy loading routing
export const routes: Routes = [
  {
    path: 'login',
    title: 'TMS Login',
    loadComponent: () =>
      import('./features/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: 'signup',
    title: 'TMS Sign Up',
    loadComponent: () =>
      import('./features/signup/signup.component').then(
        (m) => m.SignupComponent,
      ),
  },
    {
    path: "dashboard",
    title: 'TMS Dashboard',
    loadComponent: () =>
        import("./features/student-dashboard/student-dashboard.component").then(
    (m) => m.StudentDashboardComponent,
),
},

{
    path: "courses/:id",
    title: 'TMS Course Details',
    loadComponent: () =>
      import("./features/course-detail/course-detail.component").then(
        (m) => m.CourseDetailComponent
      ),
  },

{
path: 'enroll',
title: 'TMS Enroll',
loadComponent: () => 
import('./features/enrollment-form/enrollment-form').then
  (m => m.EnrollmentForm)
},
{
  path: 'enrollments',
  title: 'TMS Enrollments',
  loadComponent: () =>
    import('./features/enrollment-list/enrollment-list.component').then(
      (m) => m.EnrollmentListComponent),
  },
  {
  path: 'Ins-dashboard',
  title: 'TMS Instructor Dashboard',
  loadComponent: () =>
    import('./features/instructor-dashboard/instructor-dashboard.component').then
      (m => m.InstructorDashboardComponent)
  },
  {
    path: 'grade-submission',
    title: 'TMS Grade Submission',
  loadComponent: () =>
    import('./features/grade-submission/grade-submission.component').then
      (m => m.GradeSubmissionComponent)
  },
  {
    path: 'admin/courses/new',
    title: 'TMS Create Course',
    loadComponent: () =>
      import('./features/admin-course-create/admin-course-create.component').then(
        (m) => m.AdminCourseCreateComponent,
      ),
    canActivate: [roleGuard('Admin')],
  },
  {
    path: 'admin/courses',
    title: 'TMS Course Administration',
    loadComponent: () =>
      import('./features/admin-course-list/admin-course-list.component').then(
        (m) => m.AdminCourseListComponent,
      ),
    canActivate: [roleGuard('Admin')],
  },
  
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
