import {StationAsset} from '../../../shared/models/station-assets';
import {assetActions} from '../actions/asset.actions';
import {AssetState} from '../states/asset.state';
import {assetFeature, initialState} from './asset.reducer';

describe('Asset Reducer', () => {
  let state: AssetState;

  beforeEach(() => {
    state = {
      loadingState: 'loading',
      assets: [],
    };
  });

  it('should set loadingState to loading when loadAssetsForStation is dispatched', () => {
    state.loadingState = 'error';
    const action = assetActions.loadAssetsForStation({stationId: 'testStationId', collection: 'testCollection'});

    const result = assetFeature.reducer(state, action);

    expect(result).toEqual({
      ...initialState,
      loadingState: 'loading',
    });
  });

  it('should set assets and loadingState to loaded when setLoadedAssets is dispatched', () => {
    const assets: StationAsset[] = [
      {
        timeRange: 'recent',
        url: 'testUrl',
        filename: 'testFilename',
        interval: 'monthly',
      },
    ];
    const action = assetActions.setLoadedAssets({assets});

    const result = assetFeature.reducer(state, action);

    expect(result).toEqual({
      loadingState: 'loaded',
      assets,
    });
  });

  it('should reset to initialState and set loadingState to error when setAssetLoadingError is dispatched', () => {
    const action = assetActions.setAssetLoadingError({});

    const result = assetFeature.reducer(state, action);

    expect(result).toEqual({
      ...initialState,
      loadingState: 'error',
    });
  });

  it('should reset to initialState when resetState is dispatched', () => {
    const action = assetActions.resetState();

    const result = assetFeature.reducer(state, action);

    expect(result).toEqual(initialState);
  });
});
