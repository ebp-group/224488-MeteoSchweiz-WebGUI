import {produce} from 'immer';
import {collectionConfig} from '../../../shared/configs/collections.config';
import {ParameterStationMapping} from '../../../shared/models/parameter-station-mapping';
import {parameterStationMappingActions} from '../actions/parameter-station-mapping.action';
import {ParameterStationMappingState} from '../states/parameter-station-mapping.state';
import {initialState, parameterStationMappingFeature} from './parameter-station-mapping.reducer';

describe('ParameterStationMapping Reducer', () => {
  const measurementDataType = collectionConfig.defaultMeasurementDataType;

  let state: ParameterStationMappingState;

  beforeEach(() => {
    state = initialState;
  });

  it('should set loadingState to loading when loadParameterStationMappingForCollections is dispatched and loading state is currently not loaded', () => {
    state = produce(state, (draft) => {
      draft[measurementDataType].loadingState = 'error';
    });
    const action = parameterStationMappingActions.loadParameterStationMappingsForCollections({collections: ['test'], measurementDataType});
    const result = parameterStationMappingFeature.reducer(state, action);

    expect(result[measurementDataType].loadingState).toBe('loading');
    expect(result[measurementDataType].parameterStationMappings).toEqual([]);
  });

  it('should not change loadingState if it is already loaded when loadParameterStationMappingForCollections is dispatched', () => {
    state = produce(state, (draft) => {
      draft[measurementDataType].loadingState = 'loaded';
    });
    const action = parameterStationMappingActions.loadParameterStationMappingsForCollections({collections: ['test'], measurementDataType});
    const result = parameterStationMappingFeature.reducer(state, action);

    expect(result[measurementDataType].loadingState).toBe('loaded');
    expect(result[measurementDataType].parameterStationMappings).toEqual([]);
  });

  it('should set parameterStationMappings and loadingState to loaded when setLoadedParameterStationMappings is dispatched', () => {
    const parameterStationMappings: ParameterStationMapping[] = [
      {
        parameterId: 'test-parameter-id',
        stationId: 'test-station-id',
      },
    ];
    const action = parameterStationMappingActions.setLoadedParameterStationMappings({parameterStationMappings, measurementDataType});
    const result = parameterStationMappingFeature.reducer(state, action);

    expect(result[measurementDataType].parameterStationMappings).toEqual(parameterStationMappings);
    expect(result[measurementDataType].loadingState).toBe('loaded');
  });

  it('should reset to initialState and set loadingState to error when setParameterStationMappingLoadingError is dispatched', () => {
    const action = parameterStationMappingActions.setParameterStationMappingLoadingError({measurementDataType});
    const result = parameterStationMappingFeature.reducer(state, action);

    expect(result).toEqual({...initialState, [measurementDataType]: {...initialState[measurementDataType], loadingState: 'error'}});
  });
});
