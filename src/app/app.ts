import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('tms-client');
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