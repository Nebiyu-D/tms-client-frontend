import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit{
  private authService = inject(AuthService);
  protected readonly title = signal('tms-client');

  ngOnInit(): void {
    this.authService.setCurrentUser()
  }
}



// import { Component, inject, OnInit } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import { EnrollmentStore } from './store/enrollment.store';
// import { EnrollmentListComponent } from './features/enrollment-list/enrollment-list.component';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [RouterOutlet, EnrollmentListComponent],
//   templateUrl: './app.html',
//   styleUrl: './app.scss'
// })
// export class App implements OnInit {
//   readonly store = inject(EnrollmentStore);

//   ngOnInit() {
//     this.store.loadEnrollments();
//   }
// }