import {inject} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {concatLatestFrom} from '@ngrx/operators';
import {Store} from '@ngrx/store';
import {combineLatestWith, filter, map, of, switchMap, take} from 'rxjs';
import {collectionConfig} from '../../../shared/configs/collections.config';
import {DateRange} from '../../../shared/models/date-range';
import {appActions} from '../../app/actions/app.actions';
import {assetFeature} from '../../assets/reducers/asset.reducer';
import {collectionActions} from '../../collection/actions/collection.action';
import {selectCombinedLoadingState} from '../../collection/selectors/collection.selector';
import {selectParameterGroups} from '../../parameters/selectors/parameter.selector';
import {selectCurrentStationState} from '../../stations/selectors/station.selector';
import {formActions} from '../actions/form.actions';
import {formFeature} from '../reducers/form.reducer';
import {selectSelectedStationsFilteredBySelectedParameterGroup} from '../selectors/form.selector';

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

export const autoSelectFirstCollection = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(formActions.setSelectedStationId, formActions.initializeSelectedParameterGroupAndStationIdAndCollection),
      concatLatestFrom(() => [
        store.select(formFeature.selectSelectedCollection),
        store.select(selectSelectedStationsFilteredBySelectedParameterGroup),
      ]),
      filter(([, selectedCollection]) => !selectedCollection),
      map(([, , stations]) => formActions.setSelectedCollection({collection: stations.length > 0 ? stations[0].collection : null})),
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
      // we use `combineLatestWith` here to wait for all necessary collections to finish loading
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

export const initializeSelectedDataIntervalAndTimeRange = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(appActions.initializeApp),
      // we use `combineLatestWith` here to wait for parameter group id, station id and collection to be initialized
      combineLatestWith(
        store.select(formFeature.selectFormState).pipe(
          filter(({isParameterGroupStationAndCollectionInitialized}) => isParameterGroupStationAndCollectionInitialized),
          take(1),
        ),
      ),
      switchMap(([{parameter}, formState]) => {
        if (!formState.selectedStationId || !formState.selectedCollection) {
          return of(
            formActions.initializeSelectedDataIntervalAndTimeRange({dataInterval: null, timeRange: null, historicalDateRange: null}),
          );
        }
        return store.select(assetFeature.selectAssetState).pipe(
          // we wait for all necessary station assets to finish loading
          filter(({loadingState}) => loadingState === 'loaded'),
          take(1),
          map(({assets}) => {
            const dataInterval = assets?.find((asset) => asset.interval === parameter.dataInterval)?.interval ?? null;
            const timeRange = assets?.find((asset) => asset.timeRange === parameter.timeRange)?.timeRange ?? null;
            let historicalDateRange: DateRange | null = null;
            if (timeRange === 'historical' && parameter.historicalDateRange) {
              historicalDateRange =
                assets
                  ?.filter((asset) => asset.timeRange === 'historical')
                  .find(
                    (asset) =>
                      asset.dateRange &&
                      parameter.historicalDateRange &&
                      asset.dateRange.start.getTime() === parameter.historicalDateRange.start.getTime() &&
                      asset.dateRange.end.getTime() === parameter.historicalDateRange.end.getTime(),
                  )?.dateRange ?? null;
            }
            return formActions.initializeSelectedDataIntervalAndTimeRange({dataInterval, timeRange, historicalDateRange});
          }),
        );
      }),
    );
  },
  {functional: true},
);
