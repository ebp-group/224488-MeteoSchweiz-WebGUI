import {CollectionAsset} from '../../../shared/models/collection-assets';
import {loadingStates} from '../../../shared/models/loading-state';
import {ParameterStationMappingStateEntry} from '../../parameter-station-mapping/states/parameter-station-mapping.state';
import {ParameterStateEntry} from '../../parameters/states/parameter.state';
import {StationStateEntry} from '../../stations/states/station.state';
import {initialState} from '../reducers/collection.reducer';
import {CollectionState} from '../states/collection.state';
import {selectCombinedLoadingState, selectCurrentCollectionState} from './collection.selector';

describe('Collection Selectors', () => {
  describe('selectCombinedLoadingState', () => {
    loadingStates.forEach((loadingState) => {
      it(`returns '${loadingState}' if all states have this loading state`, () => {
        const parameterState = {loadingState} as ParameterStateEntry;
        const stationState = {loadingState} as StationStateEntry;
        const mappingState = {loadingState} as ParameterStationMappingStateEntry;

        const result = selectCombinedLoadingState.projector(parameterState, stationState, mappingState);
        expect(result).toBe(loadingState);
      });
    });

    it('returns `undefined` when there is a mix of different loading states', () => {
      const parameterState = {loadingState: 'loaded'} as ParameterStateEntry;
      const stationState = {loadingState: 'loading'} as StationStateEntry;
      const mappingState = {loadingState: undefined} as ParameterStationMappingStateEntry;

      const result = selectCombinedLoadingState.projector(parameterState, stationState, mappingState);
      expect(result).toBe(undefined);
    });
  });

  describe('selectCurrentCollectionState', () => {
    let state: CollectionState;
    beforeEach(() => {
      state = structuredClone(initialState);
    });
    it('should return the current parameter state based on the selected measurement data type', () => {
      const measurementDataType = 'normal';
      const assets: CollectionAsset[] = [
        {
          collection: 'collection',
          filename: 'meta.csv',
          metaFileType: 'station',
          url: '',
        },
      ];
      state[measurementDataType].collectionAssets = assets;
      state[measurementDataType].loadingState = 'loaded';

      const result = selectCurrentCollectionState.projector(state, measurementDataType);

      expect(result.collectionAssets).toEqual(jasmine.arrayWithExactContents(assets));
      expect(result.loadingState).toBe('loaded');
    });
  });
});
