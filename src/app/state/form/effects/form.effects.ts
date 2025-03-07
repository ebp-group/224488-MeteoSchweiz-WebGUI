import {inject} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {concatLatestFrom} from '@ngrx/operators';
import {Store} from '@ngrx/store';
import {filter, map} from 'rxjs';
import {collectionConfig} from '../../../shared/configs/collections.config';
import {collectionActions} from '../../collection/actions/collection.action';
import {formActions} from '../actions/form.actions';
import {selectSelectedStationWithParameterGroupFilteredBySelectedParameterGroup} from '../selectors/form.selector';

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

export const autoSelectStationType = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(formActions.setSelectedStationId),
      filter(({stationId}) => stationId != null),
      concatLatestFrom(() => store.select(selectSelectedStationWithParameterGroupFilteredBySelectedParameterGroup)),
      filter(([, stations]) => stations.length === 1),
      map(([, stations]) => formActions.setSelectedCollection({collection: stations[0].station.collection})),
    );
  },
  {functional: true},
);
