import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Enrollment } from '../models/enrollment.model';

@Service()
export class EnrollmentService {
    private http = inject(HttpClient);
    private baseurl = 'http://localhost:5089/api/v2/enrollments';

    getAll(): Observable<Enrollment[]>{
        return this.http.get<Enrollment[]>(this.baseurl);
    }
    approve(id: string): Observable<void>{
        return this.http.post<void>(`${this.baseurl}/${id}/approve`, {});
    }
}