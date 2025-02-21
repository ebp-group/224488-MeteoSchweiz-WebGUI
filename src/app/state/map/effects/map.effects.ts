import {inject} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {concatLatestFrom} from '@ngrx/operators';
import {Store} from '@ngrx/store';
import {tap} from 'rxjs';
import {MapService} from '../../../map/services/map.service';
import {formActions} from '../../form/actions/form.actions';
import {stationActions} from '../../stations/actions/station.action';
import {stationFeature} from '../../stations/reducers/station.reducer';

export const addStationsToMap = createEffect(
  (actions$ = inject(Actions), mapService = inject(MapService)) => {
    return actions$.pipe(
      ofType(stationActions.setLoadedStations),
      tap(({stations}) => mapService.addStationsToMap(stations)),
    );
  },
  {functional: true, dispatch: false},
);

export const filterStationsOnMap = createEffect(
  (actions$ = inject(Actions), store = inject(Store), mapService = inject(MapService)) => {
    return actions$.pipe(
      ofType(formActions.setSelectedParameters),
      // TODO the following selector has to be replaced with one that returns stations filtered by the current parameter group selection
      concatLatestFrom(() => store.select(stationFeature.selectStations)),
      tap(([, stations]) => mapService.filterStationsOnMap(stations)),
    );
  },
  {functional: true, dispatch: false},
);
