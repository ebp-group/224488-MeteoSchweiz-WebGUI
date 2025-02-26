import {inject} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {concatLatestFrom} from '@ngrx/operators';
import {Store} from '@ngrx/store';
import {catchError, filter, from, map, of, switchMap, tap} from 'rxjs';
import {ParameterError} from '../../../shared/errors/parameter.error';
import {ParameterService} from '../../../stac/service/parameter.service';
import {collectionActions} from '../../collection/actions/collection.action';
import {parameterActions} from '../actions/parameter.action';
import {selectCurrentParameterState} from '../selectors/parameter.selector';

export const loadCollectionParameters = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(collectionActions.loadCollections),
      map(({measurementDataType, collections}) => parameterActions.loadParametersForCollections({collections, measurementDataType})),
    );
  },
  {functional: true},
);

export const loadParameters = createEffect(
  (actions$ = inject(Actions), store = inject(Store), parameterService = inject(ParameterService)) => {
    return actions$.pipe(
      ofType(parameterActions.loadParametersForCollections),
      concatLatestFrom(() => store.select(selectCurrentParameterState)),
      filter(([_, parameterState]) => parameterState.loadingState !== 'loaded'),
      switchMap(([{collections, measurementDataType}]) =>
        from(parameterService.loadParameterForCollections(collections)).pipe(
          map((parameters) => parameterActions.setLoadedParameters({parameters, measurementDataType})),
          catchError((error: unknown) => of(parameterActions.setParameterLoadingError({error, measurementDataType}))),
        ),
      ),
    );
  },
  {functional: true},
);

export const failLoadingCollectionParameters = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(parameterActions.setParameterLoadingError),
      tap(({error}) => {
        throw new ParameterError(error);
      }),
    );
  },
  {functional: true, dispatch: false},
);
