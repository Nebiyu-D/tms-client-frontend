import { inject } from '@angular/core';
import { signalStore, withMethods, withState, patchState } from '@ngrx/signals';
import { removeEntity, setAllEntities, withEntities } from '@ngrx/signals/entities';
import { catchError, EMPTY } from 'rxjs';
import { CourseService } from '../services/course.service';
import { Course } from '../models/course.model';

export const CourseStore = signalStore(
  { providedIn: 'root' },
  withEntities<Course>(),
  withState({error:''}),
  withMethods((store, svc = inject(CourseService)) => ({
    deleteCourse(id: number) {
      // 1. Snapshot state BEFORE mutating local UI
      const previousSnapshot = store.entities();

      // 2. Remove entity immediately for instant feedback
      patchState(store, removeEntity(id));

      // 3. Dispatch delete request to backend
      svc.delete(id).pipe(
        catchError(() => {
          // 4. Server error (e.g. 409 Conflict): Rollback to snapshot
          patchState(store, setAllEntities(previousSnapshot));
          patchState(store, {
            error: 'Cannot delete course: active student enrollments exist.'
          });
          return EMPTY;
        })
      ).subscribe();
    }
  }))
);


