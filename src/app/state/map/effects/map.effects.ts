import {inject} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {concatLatestFrom} from '@ngrx/operators';
import {Store} from '@ngrx/store';
import {catchError, filter, from, map, of, switchMap, tap} from 'rxjs';
import {MapService} from '../../../map/services/map.service';
import {mapConfig} from '../../../shared/configs/map.config';
import {MapLoadError} from '../../../shared/errors/map.error';
import {collectionActions} from '../../collection/actions/collection.action';
import {formActions} from '../../form/actions/form.actions';
import {formFeature} from '../../form/reducers/form.reducer';
import {stationActions} from '../../stations/actions/station.action';
import {
  selectCurrentStationState,
  selectPrioritizedUniqueStations,
  selectUniqueStationIdsFilteredBySelectedParameterGroups,
} from '../../stations/selectors/station.selector';
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
        throw new MapLoadError(error);
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
      concatLatestFrom(() => store.select(selectPrioritizedUniqueStations)),
      tap(([, stations]) => mapService.addStationsToMap(stations)),
      map(() => mapActions.completeLayersInitialization()),
    );
  },
  {functional: true},
);

export const filterStationsOnMap = createEffect(
  (actions$ = inject(Actions), store = inject(Store), mapService = inject(MapService)) => {
    return actions$.pipe(
      ofType(
        formActions.setSelectedParameters,
        mapActions.completeLayersInitialization,
        formActions.initializeSelectedParameterGroupAndStationIdAndCollection,
      ),
      concatLatestFrom(() => store.select(mapFeature.selectMapsState)),
      filter(([, {loadingState, areLayersInitialized}]) => loadingState === 'loaded' && areLayersInitialized),
      concatLatestFrom(() => store.select(selectUniqueStationIdsFilteredBySelectedParameterGroups)),
      tap(([, stationIds]) => mapService.filterStationsOnMap(stationIds)),
    );
  },
  {functional: true, dispatch: false},
);

export const toggleStationSelection = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(mapActions.toggleStationSelection),
      concatLatestFrom(() => store.select(formFeature.selectSelectedStationId)),
      map(([{stationId}, selectedStationId]) => {
        if (stationId === selectedStationId) {
          return formActions.setSelectedStationId({stationId: null});
        }
        return formActions.setSelectedStationId({stationId});
      }),
    );
  },
  {functional: true},
);

export const highlightSelectedStationOnMap = createEffect(
  (actions$ = inject(Actions), store = inject(Store), mapService = inject(MapService)) => {
    return actions$.pipe(
      ofType(
        formActions.setSelectedStationId,
        formActions.setSelectedParameters,
        mapActions.setMapAsLoaded,
        formActions.initializeSelectedParameterGroupAndStationIdAndCollection,
      ),
      concatLatestFrom(() => store.select(mapFeature.selectLoadingState)),
      filter(([, loadingState]) => loadingState === 'loaded'),
      concatLatestFrom(() => store.select(formFeature.selectSelectedStationId)),
      map(([_, selectedStationId]) => selectedStationId),
      tap((selectedStationId) => {
        if (selectedStationId) {
          mapService.highlightStation(selectedStationId);
        } else {
          mapService.removeHighlight();
        }
      }),
    );
  },
  {functional: true, dispatch: false},
);
