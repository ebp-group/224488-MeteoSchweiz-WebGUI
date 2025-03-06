import {inject} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {concatLatestFrom} from '@ngrx/operators';
import {Store} from '@ngrx/store';
import {combineLatestWith, filter, map, switchMap, take} from 'rxjs';
import {collectionConfig} from '../../../shared/configs/collections.config';
import {UrlParameterService} from '../../../shared/services/url-parameter.service';
import {appActions} from '../../app/actions/app.actions';
import {collectionActions} from '../../collection/actions/collection.action';
import {selectCurrentParameterState, selectParameterGroups} from '../../parameters/selectors/parameter.selector';
import {selectCurrentStationState} from '../../stations/selectors/station.selector';
import {formActions} from '../actions/form.actions';

export const loadCollectionsForSelectedMeasurementDataType = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(formActions.setSelectedMeasurementDataType),
      map(({measurementDataType}) =>
        collectionActions.loadCollections({measurementDataType, collections: collectionConfig.collections[measurementDataType]}),
      ),
    );
  },
  {functional: true},
);

export const initializeSelectedMeasurementDataType = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(appActions.initializeApp),
      map(({parameter}) => formActions.setSelectedMeasurementDataType({measurementDataType: parameter.measurementDataType})),
    );
  },
  {functional: true},
);

export const initializeSelectedParameterGroupId = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(appActions.initializeApp),
      filter(({parameter}) => !!parameter.parameterGroupId),
      // we use `combineLatestWith` here to wait for the parameters to finish loading
      combineLatestWith(
        store.select(selectCurrentParameterState).pipe(
          filter(({loadingState}) => loadingState === 'loaded'),
          take(1),
        ),
      ),
      concatLatestFrom(() => store.select(selectParameterGroups)),
      map(([[{parameter}, _], parameterGroups]) => {
        if (parameterGroups.some((parameterGroup) => parameterGroup.id === parameter.parameterGroupId)) {
          return formActions.setSelectedParameters({parameterGroupId: parameter.parameterGroupId});
        }
        return formActions.setSelectedParameters({parameterGroupId: null});
      }),
    );
  },
  {functional: true},
);

export const initializeSelectedStationId = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(appActions.initializeApp),
      filter(({parameter}) => !!parameter.stationId),
      // we use `combineLatestWith` here to wait for the parameters to finish loading
      combineLatestWith(
        store.select(selectCurrentStationState).pipe(
          filter(({loadingState}) => loadingState === 'loaded'),
          take(1),
        ),
      ),
      map(([{parameter}, {stations}]) => {
        if (stations.some((station) => station.id === parameter.stationId)) {
          return formActions.setSelectedStationId({stationId: parameter.stationId});
        }
        return formActions.setSelectedStationId({stationId: null});
      }),
    );
  },
  {functional: true},
);

export const setSelectedMeasurementDataTypeInUrl = createEffect(
  (actions$ = inject(Actions), urlParameterService = inject(UrlParameterService)) => {
    return actions$.pipe(
      ofType(formActions.setSelectedMeasurementDataType),
      switchMap(({measurementDataType}) => urlParameterService.setMeasurementDataType(measurementDataType)),
    );
  },
  {functional: true, dispatch: false},
);

export const setSelectedParameterGroupIdInUrl = createEffect(
  (actions$ = inject(Actions), urlParameterService = inject(UrlParameterService)) => {
    return actions$.pipe(
      ofType(formActions.setSelectedParameters),
      switchMap(({parameterGroupId}) => urlParameterService.setParameterGroupId(parameterGroupId)),
    );
  },
  {functional: true, dispatch: false},
);

export const setSelectedStationIdInUrl = createEffect(
  (actions$ = inject(Actions), urlParameterService = inject(UrlParameterService)) => {
    return actions$.pipe(
      ofType(formActions.setSelectedStationId),
      switchMap(({stationId}) => urlParameterService.setStationId(stationId)),
    );
  },
  {functional: true, dispatch: false},
);
