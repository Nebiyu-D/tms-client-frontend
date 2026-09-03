import { Routes } from '@angular/router';
import { roleGuard } from './guards/role.guards';


// we used lazy loading routing
export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./features/signup/signup.component').then(
        (m) => m.SignupComponent,
      ),
  },
    {
    path: "dashboard",
    loadComponent: () =>
        import("./features/student-dashboard/student-dashboard.component").then(
    (m) => m.StudentDashboardComponent,
),
},

{
    path: "courses/:id",
    loadComponent: () =>
      import("./features/course-detail/course-detail.component").then(
        (m) => m.CourseDetailComponent
      ),
  },

{
path: 'enroll',
loadComponent: () => 
import('./features/enrollment-form/enrollment-form').then
  (m => m.EnrollmentForm)
},
{
  path: 'enrollments',
  loadComponent: () =>
    import('./features/enrollment-list/enrollment-list.component').then(
      (m) => m.EnrollmentListComponent),
  },
  {
  path: 'Ins-dashboard',
  loadComponent: () =>
    import('./features/instructor-dashboard/instructor-dashboard.component').then
      (m => m.InstructorDashboardComponent)
  },
  {
    path: 'grade-submission',
  loadComponent: () =>
    import('./features/grade-submission/grade-submission.component').then
      (m => m.GradeSubmissionComponent)
  },
  // {
  
  // path: 'admin/courses',
  // component: AdminCourseListComponent,
  // canActivate: [roleGuard('Admin')]
  // },
  
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
