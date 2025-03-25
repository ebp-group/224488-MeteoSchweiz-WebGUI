import {collectionConfig} from '../../../shared/configs/collections.config';
import {CollectionAsset} from '../../../shared/models/collection-assets';
import {collectionActions} from '../actions/collection.action';
import {CollectionState} from '../states/collection.state';
import {collectionFeature, initialState} from './collection.reducer';

describe('Collection Reducer', () => {
  const measurementDataType = collectionConfig.defaultMeasurementDataType;

  let state: CollectionState;

  beforeEach(() => {
    state = structuredClone(initialState);
  });

  it('should set loadingState to loading when loadCollection is dispatched and loading state is currently not loaded', () => {
    state[measurementDataType].loadingState = 'error';
    const action = collectionActions.loadCollections({collections: ['test'], measurementDataType});

    const result = collectionFeature.reducer(state, action);

    expect(result[measurementDataType].loadingState).toBe('loading');
    expect(result[measurementDataType].collectionAssets).toEqual([]);
  });

  it('should not change loadingState if it is already loaded when loadCollection is dispatched', () => {
    state[measurementDataType].loadingState = 'loaded';
    const action = collectionActions.loadCollections({collections: ['test'], measurementDataType});

    const result = collectionFeature.reducer(state, action);

    expect(result[measurementDataType].loadingState).toBe('loaded');
    expect(result[measurementDataType].collectionAssets).toEqual([]);
  });

  it('should set collection assets and loadingState to loaded when setCollectionAssets is dispatched', () => {
    const assets: CollectionAsset[] = [
      {
        collection: 'collection',
        filename: 'meta.csv',
        metaFileType: 'station',
        url: '',
      },
    ];
    const action = collectionActions.setCollectionAssets({assets, measurementDataType});

    const result = collectionFeature.reducer(state, action);

    expect(result[measurementDataType].loadingState).toBe('loaded');
    expect(result[measurementDataType].collectionAssets).toEqual(assets);
  });

  it('should reset to initialState and set loadingState to error when setCollectionAssetLoadingError is dispatched', () => {
    const action = collectionActions.setCollectionAssetLoadingError({measurementDataType});

    const result = collectionFeature.reducer(state, action);

    expect(result).toEqual({
      ...initialState,
      [measurementDataType]: {...initialState[measurementDataType], loadingState: 'error'},
    });
  });
});
