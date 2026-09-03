import { AfterViewInit, Component, effect, inject, viewChild } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { EnrollmentStore } from '../../store/enrollment.store';
import { Enrollment } from '../../models/enrollment.model';

@Component ({
  selector: 'tms-enrollment-list',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule],
  templateUrl: './enrollment-list.component.html',
  styleUrl: './enrollment-list.component.scss'
})
export class EnrollmentListComponent implements AfterViewInit {
  store = inject(EnrollmentStore);
  displayedColumns = ['studentName', 'courseName', 'status', 'actions'];
  dataSource = new MatTableDataSource<Enrollment>();
  readonly paginator = viewChild.required(MatPaginator);
  readonly sort = viewChild.required(MatSort);

  constructor() {
    effect(() => {
      this.dataSource.data = this.store.entities();
    });

    this.store.loadEnrollments();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator();
    this.dataSource.sort = this.sort();
  }
}






// import { Component, inject, OnInit } from '@angular/core';
// import { EnrollmentStore } from '../../store/enrollment.store';

// @Component({
//   selector: 'tms-enrollment-list',
//   standalone: true,
//   templateUrl: './enrollment-list.component.html'
// })
// export class EnrollmentListComponent implements OnInit {
//   store = inject(EnrollmentStore);

//   ngOnInit() {
//     this.store.loadEnrollments();
//   }

//   onApprove(id: string) {
//     this.store.approveEnrollment(id);
//   }
// }