import {inject} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {map} from 'rxjs';
import {collectionConfig} from '../../../shared/configs/collections.config';
import {collectionActions} from '../../collection/actions/collection.action';
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

export const removeStationSelectionOnSelectedParameterChange = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(formActions.setSelectedParameters),
      map(() => formActions.setSelectedStationId({stationId: null})),
    );
  },
  {functional: true},
);
