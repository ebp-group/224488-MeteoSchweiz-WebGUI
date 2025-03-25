import {createFeature, createReducer, on} from '@ngrx/store';
import {produce} from 'immer';
import {collectionActions} from '../actions/collection.action';
import {CollectionState, CollectionStateEntry} from '../states/collection.state';

export const collectionFeatureKey = 'collection';

export const initialEntryState: CollectionStateEntry = {
  loadingState: undefined,
  collectionAssets: [],
};
export const initialState: CollectionState = {
  homogenous: {...initialEntryState},
  normal: {...initialEntryState},
};

export const collectionFeature = createFeature({
  name: collectionFeatureKey,
  reducer: createReducer(
    initialState,
    on(
      collectionActions.loadCollections,
      produce((draft, {measurementDataType}) => {
        const state = draft[measurementDataType];
        state.loadingState = state.loadingState !== 'loaded' ? 'loading' : state.loadingState;
      }),
    ),
    on(
      collectionActions.setCollectionAssets,
      produce((draft, {assets, measurementDataType}) => {
        const state = draft[measurementDataType];
        state.collectionAssets = assets;
        state.loadingState = 'loaded';
      }),
    ),
    on(
      collectionActions.setCollectionAssetLoadingError,
      produce((draft, {measurementDataType}) => {
        draft[measurementDataType] = {...initialEntryState, loadingState: 'error'};
      }),
    ),
  ),
});
