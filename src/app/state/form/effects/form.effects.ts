import {inject} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {concatLatestFrom} from '@ngrx/operators';
import {Store} from '@ngrx/store';
import {combineLatestWith, filter, map, take} from 'rxjs';
import {collectionConfig} from '../../../shared/configs/collections.config';
import {appActions} from '../../app/actions/app.actions';
import {collectionActions} from '../../collection/actions/collection.action';
import {selectCombinedLoadingState} from '../../collection/selectors/collection.selector';
import {selectParameterGroups} from '../../parameters/selectors/parameter.selector';
import {selectCurrentStationState} from '../../stations/selectors/station.selector';
import {formActions} from '../actions/form.actions';
import {selectSelectedStationWithParameterGroupsFilteredBySelectedParameterGroup} from '../selectors/form.selector';

export const loadCollectionsForSelectedMeasurementDataType = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(formActions.setSelectedMeasurementDataType, formActions.initializeSelectedMeasurementDataType),
      map(({measurementDataType}) =>
        collectionActions.loadCollections({measurementDataType, collections: collectionConfig.collections[measurementDataType]}),
      ),
    );
  },
  {functional: true},
);

export const autoSelectCollection = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(formActions.setSelectedStationId),
      concatLatestFrom(() => store.select(selectSelectedStationWithParameterGroupsFilteredBySelectedParameterGroup)),
      map(([, stations]) => formActions.setSelectedCollection({collection: stations.length === 1 ? stations[0].collection : null})),
    );
  },
  {functional: true},
);

export const initializeSelectedMeasurementDataType = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(appActions.initializeApp),
      map(({parameter}) => formActions.initializeSelectedMeasurementDataType({measurementDataType: parameter.measurementDataType})),
    );
  },
  {functional: true},
);

export const initializeSelectedStationIdAndParameterGroupIdAndCollection = createEffect(
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
        const collection =
          stations.filter((station) => station.id === stationId).find((station) => station.collection === parameter.collection)
            ?.collection ?? null;
        return formActions.initializeSelectedParameterGroupAndStationIdAndCollection({parameterGroupId, stationId, collection});
      }),
    );
  },
  {functional: true},
);
