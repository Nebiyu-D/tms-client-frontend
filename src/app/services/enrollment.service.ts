import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Enrollment } from '../models/enrollment.model';

interface StudentLookup {
    id: number;
    registrationNumber: string;
}

export interface EnrollmentRequest {
    registrationNumber: string;
    courseId: number;
}

@Injectable({ providedIn: 'root' })
export class EnrollmentService {
    private http = inject(HttpClient);
    private baseurl = '/api';

    getAll(): Observable<Enrollment[]>{
        return this.http.get<Enrollment[]>(`${this.baseurl}/v2/enrollments`);
    }

    enroll(request: EnrollmentRequest): Observable<unknown> {
        return new Observable((subscriber) => {
            this.http.get<StudentLookup[]>(`${this.baseurl}/students`).subscribe({
                next: (students) => {
                    const student = students.find(
                        (item) => item.registrationNumber.toUpperCase() === request.registrationNumber.trim().toUpperCase()
                    );

                    if (!student) {
                        subscriber.error({ error: { detail: `Student '${request.registrationNumber}' was not found.` } });
                        return;
                    }

                    this.http.post(
                        `${this.baseurl}/courses/${request.courseId}/enrollments`,
                        { studentId: student.id }
                    ).subscribe(subscriber);
                },
                error: (error) => subscriber.error(error),
            });
        });
    }
    approve(id: string): Observable<void>{
        return this.http.post<void>(`${this.baseurl}/v2/enrollments/${id}/approve`, {});
    }
}