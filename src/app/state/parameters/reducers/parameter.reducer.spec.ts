import {Parameter} from '../../../shared/models/parameter';
import {parameterActions} from '../actions/parameter.action';
import {ParameterState} from '../states/parameter.state';
import {initialState, parameterFeature} from './parameter.reducer';

describe('Parameter Reducer', () => {
  let state: ParameterState;

  beforeEach(() => {
    state = initialState;
  });

  it('should set loadingState to loading when loadParameterForCollections is dispatched and loading state is currently not loaded', () => {
    state = {...state, loadingState: 'error'};
    const action = parameterActions.loadParametersForCollections({collections: ['test']});
    const result = parameterFeature.reducer(state, action);

    expect(result.loadingState).toBe('loading');
    expect(result.parameters).toEqual([]);
  });

  it('should not change loadingState if it is already loaded when loadParameterForCollections is dispatched', () => {
    state = {...state, loadingState: 'loaded'};
    const action = parameterActions.loadParametersForCollections({collections: ['test']});
    const result = parameterFeature.reducer(state, action);

    expect(result.loadingState).toBe('loaded');
    expect(result.parameters).toEqual([]);
  });

  it('should set parameters and loadingState to loaded when setLoadedParameters is dispatched', () => {
    const parameters: Parameter[] = [
      {
        id: 'test-parameter-id',
        description: {de: 'test-description', en: 'test-description', fr: 'test-description', it: 'test-description'},
        group: {de: 'test-group', en: 'test-group', fr: 'test-group', it: 'test-group'},
      },
    ];
    const action = parameterActions.setLoadedParameters({parameters});
    const result = parameterFeature.reducer(state, action);

    expect(result.parameters).toEqual(parameters);
    expect(result.loadingState).toBe('loaded');
  });

  it('should reset to initialState and set loadingState to error when setParameterLoadingError is dispatched', () => {
    const action = parameterActions.setParameterLoadingError({});
    const result = parameterFeature.reducer(state, action);

    expect(result).toEqual({...initialState, loadingState: 'error'});
  });
});
