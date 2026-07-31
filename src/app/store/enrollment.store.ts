import { computed, inject } from '@angular/core';
import {
  signalStore,
  withComputed,
  withMethods,
  patchState,
  withState,
} from '@ngrx/signals';
import {
  withEntities,
  setAllEntities,
  updateEntity,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, concatMap, tap, catchError, EMPTY } from 'rxjs';
import { EnrollmentService } from '../services/enrollment';
import { Enrollment } from '../models/enrollment.model';

export const EnrollmentStore = signalStore(
  { providedIn: 'root' },
  // Simple state properties
  withState({ isLoading: false, error: null as string | null }),
  
  // Entity collection providing O(1) lookups and updates by ID
  withEntities<Enrollment>(),
  
  // Derived computed signal recalculates automatically when entities change
  withComputed((store) => ({
    pendingCount: computed(
      () => store.entities().filter((e) => e.status === 'Pending').length
    ),
  })),

  // Reactive methods handling API side-effects and state updates
  withMethods((store, api = inject(EnrollmentService)) => ({
    loadEnrollments: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        concatMap(() =>
          api.getAll().pipe(
            tap((rows) =>
              patchState(store, setAllEntities(rows), { isLoading: false })
            ),
            catchError((err) => {
              patchState(store, {
                isLoading: false,
                error: err.message || 'Failed to load enrollments.',
              });
              return EMPTY;
            })
          )
        )
      )
    ),

    approveEnrollment: rxMethod<string>(
      pipe(
        tap((id) => {
          // Optimistic Update: Immediately update UI before HTTP call
          patchState(
            store,
            updateEntity({ id, changes: { status: 'Approved' } })
          );
        }),
        concatMap((id) =>
          api.approve(id).pipe(
            catchError((err) => {
              // Rollback to previous state on server failure
              patchState(
                store,
                updateEntity({ id, changes: { status: 'Pending' } }),
                { error: 'Server rejected the approval. Check enrollment constraints.' }
              );
              return EMPTY;
            })
          )
        )
      )
    ),
  }))
);