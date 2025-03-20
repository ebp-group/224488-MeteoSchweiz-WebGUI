import {collectionConfig} from '../../../shared/configs/collections.config';
import {CollectionAsset} from '../../../shared/models/collection-assets';
import {measurementDataTypes} from '../../../shared/models/measurement-data-type';
import {Parameter} from '../../../shared/models/parameter';
import {parameterActions} from '../actions/parameter.action';
import {ParameterState} from '../states/parameter.state';
import {initialState, parameterFeature} from './parameter.reducer';

describe('Parameter Reducer', () => {
  let state: ParameterState;
  const measurementDataType = collectionConfig.defaultMeasurementDataType;
  const parameters: Parameter[] = [
    {
      id: 'test-parameter-id',
      group: {de: 'test-group', en: 'test-group', fr: 'test-group', it: 'test-group'},
    },
  ];
  const collectionAssets: CollectionAsset[] = [
    {
      filename: 'stations.csv',
      metaFileType: 'station',
      url: 'station://',
      collection: 'test',
    },
  ];

  beforeEach(() => {
    state = structuredClone(initialState);
  });

  it('should not affect other measurement types', () => {
    const otherMeasurementDataType = measurementDataTypes.find((dataType) => dataType !== measurementDataType);
    if (!otherMeasurementDataType) {
      fail('There is no other measurement data type defined. Test does not work');
      return;
    }
    const action = parameterActions.setLoadedParameters({parameters, measurementDataType});

    const result = parameterFeature.reducer(state, action);

    expect(result[otherMeasurementDataType].parameters).toEqual(initialState[otherMeasurementDataType].parameters);
    expect(result[otherMeasurementDataType].loadingState).toBe(initialState[otherMeasurementDataType].loadingState);
  });

  it('should set loadingState to loading when loadParameterForCollections is dispatched and loading state is currently not loaded', () => {
    state[measurementDataType].loadingState = 'error';
    const action = parameterActions.loadParametersForCollections({collectionAssets, measurementDataType});

    const result = parameterFeature.reducer(state, action);

    expect(result[measurementDataType].loadingState).toBe('loading');
    expect(result[measurementDataType].parameters).toEqual([]);
  });

  it('should not change loadingState if it is already loaded when loadParameterForCollections is dispatched', () => {
    state[measurementDataType].loadingState = 'loaded';
    const action = parameterActions.loadParametersForCollections({collectionAssets, measurementDataType});

    const result = parameterFeature.reducer(state, action);

    expect(result[measurementDataType].loadingState).toBe('loaded');
    expect(result[measurementDataType].parameters).toEqual([]);
  });

  it('should set parameters and loadingState to loaded when setLoadedParameters is dispatched', () => {
    const action = parameterActions.setLoadedParameters({parameters, measurementDataType});

    const result = parameterFeature.reducer(state, action);

    expect(result[measurementDataType].parameters).toEqual(parameters);
    expect(result[measurementDataType].loadingState).toBe('loaded');
  });

  it('should reset to initialState and set loadingState to error when setParameterLoadingError is dispatched', () => {
    const action = parameterActions.setParameterLoadingError({measurementDataType});

    const result = parameterFeature.reducer(state, action);

    expect(result).toEqual({
      ...initialState,
      [measurementDataType]: {...initialState[measurementDataType], loadingState: 'error'},
    });
  });
});
