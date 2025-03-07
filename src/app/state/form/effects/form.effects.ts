import {inject} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {concatLatestFrom} from '@ngrx/operators';
import {Store} from '@ngrx/store';
import {combineLatestWith, filter, map, switchMap, take} from 'rxjs';
import {collectionConfig} from '../../../shared/configs/collections.config';
import {UrlParameterService} from '../../../shared/services/url-parameter.service';
import {appActions} from '../../app/actions/app.actions';
import {collectionActions} from '../../collection/actions/collection.action';
import {selectCombinedLoadingState} from '../../collection/selectors/collection.selector';
import {selectParameterGroups} from '../../parameters/selectors/parameter.selector';
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

export const initializeSelectedStationAndParameterGroupId = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(appActions.initializeApp),
      // we use `combineLatestWith` here to wait for the parameters to finish loading
      combineLatestWith(
        store.select(selectCombinedLoadingState).pipe(
          filter((loadingState) => loadingState === 'loaded'),
          take(1),
        ),
      ),
      concatLatestFrom(() => [store.select(selectParameterGroups), store.select(selectCurrentStationState)]),
      map(([[{parameter}], parameterGroups, {stations}]) => {
        const parameterGroupId =
          parameterGroups.map((parameterGroup) => parameterGroup.id).find((id) => id === parameter.parameterGroupId) ?? null;
        const stationId = stations.map((station) => station.id).find((id) => id === parameter.stationId) ?? null;
        return formActions.setSelectedParameterGroupAndStationId({parameterGroupId, stationId});
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
