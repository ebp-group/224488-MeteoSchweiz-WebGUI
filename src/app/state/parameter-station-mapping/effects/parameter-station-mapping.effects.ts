import {inject} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {concatLatestFrom} from '@ngrx/operators';
import {Store} from '@ngrx/store';
import {catchError, filter, from, map, of, switchMap, tap} from 'rxjs';
import {ParameterStationMappingError} from '../../../shared/errors/parameter-station-mapping.error';
import {DataInventoryService} from '../../../stac/service/data-inventory.service';
import {collectionActions} from '../../collection/actions/collection.action';
import {parameterStationMappingActions} from '../actions/parameter-station-mapping.action';
import {parameterStationMappingFeature} from '../reducers/parameter-station-mapping.reducer';

export const loadCollectionParameterStationMappings = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(collectionActions.loadCollections),
      map(({collections}) => parameterStationMappingActions.loadParameterStationMappingsForCollections({collections})),
    );
  },
  {functional: true},
);

export const loadParameterStationMappings = createEffect(
  (actions$ = inject(Actions), store = inject(Store), dataInventoryService = inject(DataInventoryService)) => {
    return actions$.pipe(
      ofType(parameterStationMappingActions.loadParameterStationMappingsForCollections),
      concatLatestFrom(() => store.select(parameterStationMappingFeature.selectLoadingState)),
      filter(([_, loadingState]) => loadingState !== 'loaded'),
      switchMap(([{collections}]) =>
        from(dataInventoryService.loadParameterStationMappingsForCollections(collections)).pipe(
          map((parameterStationMappings) => parameterStationMappingActions.setLoadedParameterStationMappings({parameterStationMappings})),
          catchError((error: unknown) => of(parameterStationMappingActions.setParameterStationMappingLoadingError({error}))),
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
      tap(() => {
        throw new ParameterStationMappingError();
      }),
    );
  },
  {functional: true, dispatch: false},
);
