import {inject} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {concatLatestFrom} from '@ngrx/operators';
import {Store} from '@ngrx/store';
import {catchError, filter, from, map, of, switchMap, tap} from 'rxjs';
import {StationError} from '../../../shared/errors/station.error';
import {StationService} from '../../../stac/service/station.service';
import {collectionActions} from '../../collection/actions/collection.action';
import {stationActions} from '../actions/station.action';
import {stationFeature} from '../reducers/station.reducer';

export const loadCollectionStations = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(collectionActions.loadCollections),
      map(({collections}) => stationActions.loadStationsForCollections({collections})),
    );
  },
  {functional: true},
);

export const loadStations = createEffect(
  (actions$ = inject(Actions), store = inject(Store), stationService = inject(StationService)) => {
    return actions$.pipe(
      ofType(stationActions.loadStationsForCollections),
      concatLatestFrom(() => store.select(stationFeature.selectLoadingState)),
      filter(([_, loadingState]) => loadingState !== 'loaded'),
      switchMap(([{collections}]) =>
        from(stationService.loadStationsForCollections(collections)).pipe(
          map((stations) => stationActions.setLoadedStations({stations})),
          catchError((error: unknown) => of(stationActions.setStationLoadingError({error}))),
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
