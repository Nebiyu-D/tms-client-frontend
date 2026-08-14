import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service } from '@angular/core';
import { Observable } from 'rxjs';


// @Injectable({
//   providedIn: 'root',
// })

export interface GradePayload {
studentId: number;
courseId: number;
score: number;
}

@Service()
export class GradeService {
  private http = inject(HttpClient);
  postGrade(payload: GradePayload): Observable<{ id: string; success: boolean }> {
return this.http.post<{ id: string; success: boolean }>('/api/grades', payload);
}
}
