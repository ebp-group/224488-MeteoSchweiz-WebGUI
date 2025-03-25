import {inject} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {concatLatestFrom} from '@ngrx/operators';
import {Store} from '@ngrx/store';
import {catchError, filter, from, map, of, switchMap, tap} from 'rxjs';
import {CollectionError} from '../../../shared/errors/collection.error';
import {AssetService} from '../../../stac/service/asset.service';
import {collectionActions} from '../actions/collection.action';
import {selectCurrentCollectionState} from '../selectors/collection.selector';

export const loadCollectionAssets = createEffect(
  (actions$ = inject(Actions), store = inject(Store), assetService = inject(AssetService)) => {
    return actions$.pipe(
      ofType(collectionActions.loadCollections),
      concatLatestFrom(() => store.select(selectCurrentCollectionState)),
      filter(([_, collectionState]) => collectionState.loadingState !== 'loaded'),
      switchMap(([{collections, measurementDataType}]) =>
        from(assetService.loadCollectionAssets(collections)).pipe(
          map((assets) => collectionActions.setCollectionAssets({assets, measurementDataType})),
          catchError((error: unknown) => of(collectionActions.setCollectionAssetLoadingError({error, measurementDataType}))),
        ),
      ),
    );
  },
  {functional: true},
);

export const failLoadingCollectionAssets = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(collectionActions.setCollectionAssetLoadingError),
      tap(({error}) => {
        throw new CollectionError(error);
      }),
    );
  },
  {functional: true, dispatch: false},
);
