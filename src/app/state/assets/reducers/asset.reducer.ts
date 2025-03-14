import {createFeature, createReducer, on} from '@ngrx/store';
import {assetActions} from '../actions/asset.actions';
import {AssetState} from '../states/asset.state';

export const assetFeatureKey = 'asset';

export const initialState: AssetState = {
  assets: undefined,
  loadingState: undefined,
};

export const assetFeature = createFeature({
  name: assetFeatureKey,
  reducer: createReducer(
    initialState,
    on(assetActions.loadAssetsForStation, (): AssetState => ({...initialState, loadingState: 'loading'})),
    on(assetActions.setLoadedAssets, (state, {assets}): AssetState => ({...state, assets, loadingState: 'loaded'})),
    on(assetActions.setAssetLoadingError, (): AssetState => ({...initialState, loadingState: 'error'})),
    on(assetActions.resetState, (): AssetState => ({...initialState})),
  ),
});
