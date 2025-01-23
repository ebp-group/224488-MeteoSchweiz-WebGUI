import {inject} from '@angular/core';
import {createEffect, Actions, ofType} from '@ngrx/effects';
import {exhaustMap, map, catchError, of, tap} from 'rxjs';
import {formActions} from '../actions/form.actions';
import {StacService} from '../../../stac/service/stac.service';

export const loadStationAssets = createEffect(
  (actions$ = inject(Actions), stacService = inject(StacService)) => {
    return actions$.pipe(
      ofType(formActions.selectStation),
      tap(({station}) => station != null && stacService.fetchAssetsForStation(station)),
    );
  },
  {functional: true, dispatch: false},
);
