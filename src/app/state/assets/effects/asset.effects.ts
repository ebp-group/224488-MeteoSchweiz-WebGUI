import {inject} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {concatLatestFrom} from '@ngrx/operators';
import {Store} from '@ngrx/store';
import {catchError, distinctUntilChanged, filter, from, map, of, switchMap, tap} from 'rxjs';
import {AssetLoadError} from '../../../shared/errors/asset.error';
import {AssetService} from '../../../stac/service/asset.service';
import {formActions} from '../../form/actions/form.actions';
import {formFeature} from '../../form/reducers/form.reducer';
import {assetActions} from '../actions/asset.actions';

export const loadAssetsForStation = createEffect(
  (actions$ = inject(Actions), store = inject(Store), assetService = inject(AssetService)) => {
    return actions$.pipe(
      ofType(formActions.setSelectedCollection, formActions.initializeSelectedParameterGroupAndStationIdAndCollection),
      concatLatestFrom(() => store.select(formFeature.selectFormState)),
      map(([_, {selectedStationId, selectedCollection}]) => ({selectedStationId, selectedCollection})),
      // use distinctUntilChanged to prevent unnecessary API calls
      distinctUntilChanged(
        (prev, curr) => prev.selectedStationId === curr.selectedStationId && prev.selectedCollection === curr.selectedCollection,
      ),
      filter(({selectedStationId, selectedCollection}) => !!selectedStationId && !!selectedCollection),
      switchMap(({selectedStationId, selectedCollection}) =>
        from(assetService.loadStationAssets(selectedCollection!, selectedStationId!)).pipe(
          map((assets) => assetActions.setLoadedAssets({assets})),
          catchError((error: unknown) => of(assetActions.setAssetLoadingError({error}))),
        ),
      ),
    );
  },
  {functional: true},
);

export const resetAssets = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(formActions.setSelectedCollection, formActions.initializeSelectedParameterGroupAndStationIdAndCollection),
      concatLatestFrom(() => store.select(formFeature.selectFormState)),
      filter(([, {selectedStationId, selectedCollection}]) => !selectedStationId || !selectedCollection),
      map(() => assetActions.resetState()),
    );
  },
  {functional: true},
);

export const failLoadingAssets = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(assetActions.setAssetLoadingError),
      tap(({error}) => {
        throw new AssetLoadError(error);
      }),
    );
  },
  {functional: true, dispatch: false},
);
