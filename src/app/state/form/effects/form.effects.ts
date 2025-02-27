import {inject} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {map} from 'rxjs';
import {formActions} from '../actions/form.actions';

export const removeStationSelectionOnSelectedParameterChange = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(formActions.setSelectedParameters),
      map(() => formActions.setSelectedStationId({stationId: null})),
    );
  },
  {functional: true},
);
