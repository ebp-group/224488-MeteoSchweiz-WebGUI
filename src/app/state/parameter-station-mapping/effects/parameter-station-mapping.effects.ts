import {inject} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {concatLatestFrom} from '@ngrx/operators';
import {Store} from '@ngrx/store';
import {catchError, filter, from, map, of, switchMap, tap} from 'rxjs';
import {ParameterStationMappingError} from '../../../shared/errors/parameter-station-mapping.error';
import {DataInventoryService} from '../../../stac/service/data-inventory.service';
import {collectionActions} from '../../collection/actions/collection.action';
import {parameterStationMappingActions} from '../actions/parameter-station-mapping.action';
import {selectCurrentParameterStationMappingState} from '../selectors/parameter-group-station-mapping.selector';

export const loadCollectionParameterStationMappings = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(collectionActions.setCollectionAssets),
      map(({measurementDataType, assets}) =>
        parameterStationMappingActions.loadParameterStationMappingsForCollections({collectionAssets: assets, measurementDataType}),
      ),
    );
  },
  {functional: true},
);

export const loadParameterStationMappings = createEffect(
  (actions$ = inject(Actions), store = inject(Store), dataInventoryService = inject(DataInventoryService)) => {
    return actions$.pipe(
      ofType(parameterStationMappingActions.loadParameterStationMappingsForCollections),
      concatLatestFrom(() => store.select(selectCurrentParameterStationMappingState)),
      filter(([_, parameterStationMappingState]) => parameterStationMappingState.loadingState !== 'loaded'),
      switchMap(([{collectionAssets, measurementDataType}]) =>
        from(dataInventoryService.loadParameterStationMappingsForCollections(collectionAssets)).pipe(
          map((parameterStationMappings) =>
            parameterStationMappingActions.setLoadedParameterStationMappings({parameterStationMappings, measurementDataType}),
          ),
          catchError((error: unknown) =>
            of(parameterStationMappingActions.setParameterStationMappingLoadingError({error, measurementDataType})),
          ),
        ),
      ),
    );
  },
  {functional: true},
);

export const failLoadingCollectionParameterStationMappings = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(parameterStationMappingActions.setParameterStationMappingLoadingError),
      tap(({error}) => {
        throw new ParameterStationMappingError(error);
      }),
    );
  },
  {functional: true, dispatch: false},
);
