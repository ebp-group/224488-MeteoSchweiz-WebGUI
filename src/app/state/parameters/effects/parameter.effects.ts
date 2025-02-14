import {inject} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {concatLatestFrom} from '@ngrx/operators';
import {Store} from '@ngrx/store';
import {catchError, filter, from, map, of, switchMap} from 'rxjs';
import {ParameterService} from '../../../stac/service/parameter.service';
import {parameterActions} from '../actions/parameter.action';
import {parameterFeature} from '../reducers/parameter.reducer';

export const loadCollectionParameters = createEffect(
  (actions$ = inject(Actions), store = inject(Store), parameterService = inject(ParameterService)) => {
    return actions$.pipe(
      ofType(parameterActions.loadParameterForCollections),
      concatLatestFrom(() => store.select(parameterFeature.selectLoadingState)),
      filter(([_, loadingState]) => loadingState !== 'loaded'),
      switchMap(([{collections}]) =>
        from(parameterService.loadParameterForCollections(collections)).pipe(
          map((parameters) => parameterActions.setLoadedParameters({parameters: parameters})),
          catchError((error: unknown) => of(parameterActions.setParameterLoadingError({error}))),
        ),
      ),
    );
  },
  {functional: true},
);
