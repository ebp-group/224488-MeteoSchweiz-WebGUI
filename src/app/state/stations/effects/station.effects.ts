import {inject} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {concatLatestFrom} from '@ngrx/operators';
import {Store} from '@ngrx/store';
import {catchError, filter, from, map, of, switchMap, tap} from 'rxjs';
import {StationError} from '../../../shared/errors/station.error';
import {StationService} from '../../../stac/service/station.service';
import {collectionActions} from '../../collection/actions/collection.action';
import {stationActions} from '../actions/station.action';
import {selectCurrentStationState} from '../selectors/station.selector';

export const loadCollectionStations = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(collectionActions.loadCollections),
      map(({measurementDataType, collections}) => stationActions.loadStationsForCollections({collections, measurementDataType})),
    );
  },
  {functional: true},
);

export const loadStations = createEffect(
  (actions$ = inject(Actions), store = inject(Store), stationService = inject(StationService)) => {
    return actions$.pipe(
      ofType(stationActions.loadStationsForCollections),
      concatLatestFrom(() => store.select(selectCurrentStationState)),
      filter(([_, stationState]) => stationState.loadingState !== 'loaded'),
      switchMap(([{collections, measurementDataType}]) =>
        from(stationService.loadStationsForCollections(collections)).pipe(
          map((stations) => stationActions.setLoadedStations({stations, measurementDataType})),
          catchError((error: unknown) => of(stationActions.setStationLoadingError({error, measurementDataType}))),
        ),
      ),
    );
  },
  {functional: true},
);

export const failLoadingCollectionStations = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(stationActions.setStationLoadingError),
      tap(({error}) => {
        throw new StationError(error);
      }),
    );
  },
  {functional: true, dispatch: false},
);
