import {inject} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {concatLatestFrom} from '@ngrx/operators';
import {Store} from '@ngrx/store';
import {catchError, filter, from, map, of, switchMap, tap} from 'rxjs';
import {MapService} from '../../../map/services/map.service';
import {mapConfig} from '../../../shared/configs/map.config';
import {MapError} from '../../../shared/errors/map.error';
import {collectionActions} from '../../collection/actions/collection.action';
import {formActions} from '../../form/actions/form.actions';
import {stationActions} from '../../stations/actions/station.action';
import {selectCurrentStationState, selectStationIdsFilteredBySelectedParameterGroups} from '../../stations/selectors/station.selector';
import {mapActions} from '../actions/map.action';
import {mapFeature} from '../reducers/map.reducer';

export const initializeMap = createEffect(
  (actions$ = inject(Actions), store = inject(Store), mapService = inject(MapService)) => {
    return actions$.pipe(
      ofType(mapActions.loadMap),
      concatLatestFrom(() => store.select(mapFeature.selectLoadingState)),
      filter(([, loadingState]) => loadingState !== 'loaded'),
      concatLatestFrom(() => store.select(mapFeature.selectMapsState)),
      map(([, {center, zoom}]) => mapService.createInitialMapViewport(zoom, center, mapConfig)),
      switchMap((initialMapViewport) =>
        from(mapService.initializeMap(mapConfig, initialMapViewport)).pipe(
          map(() => mapActions.setMapAsLoaded()),
          catchError((error: unknown) => of(mapActions.setMapLoadingError({error}))),
        ),
      ),
    );
  },
  {functional: true},
);

export const failLoadingMap = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(mapActions.setMapLoadingError),
      tap(({error}) => {
        throw new MapError(error);
      }),
    );
  },
  {functional: true, dispatch: false},
);

export const removeMap = createEffect(
  (actions$ = inject(Actions), mapService = inject(MapService)) => {
    return actions$.pipe(
      ofType(mapActions.resetState),
      tap(() => mapService.removeMap()),
    );
  },
  {functional: true, dispatch: false},
);

export const addStationsToMap = createEffect(
  (actions$ = inject(Actions), store = inject(Store), mapService = inject(MapService)) => {
    return actions$.pipe(
      ofType(stationActions.setLoadedStations, mapActions.setMapAsLoaded, collectionActions.loadCollections),
      concatLatestFrom(() => [store.select(mapFeature.selectLoadingState), store.select(selectCurrentStationState)]),
      filter(
        ([, mapLoadingState, {loadingState: stationsLoadingState}]) => mapLoadingState === 'loaded' && stationsLoadingState === 'loaded',
      ),
      tap(([, , {stations}]) => mapService.addStationsToMap(stations)),
    );
  },
  {functional: true, dispatch: false},
);

export const filterStationsOnMap = createEffect(
  (actions$ = inject(Actions), store = inject(Store), mapService = inject(MapService)) => {
    return actions$.pipe(
      ofType(formActions.setSelectedParameters, mapActions.setMapAsLoaded),
      concatLatestFrom(() => store.select(mapFeature.selectLoadingState)),
      filter(([, loadingState]) => loadingState === 'loaded'),
      concatLatestFrom(() => store.select(selectStationIdsFilteredBySelectedParameterGroups)),
      tap(([, stationIds]) => mapService.filterStationsOnMap(stationIds)),
    );
  },
  {functional: true, dispatch: false},
);
