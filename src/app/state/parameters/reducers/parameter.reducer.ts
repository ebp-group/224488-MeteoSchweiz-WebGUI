import {createFeature, createReducer, on} from '@ngrx/store';
import {parameterActions} from '../actions/parameter.action';
import {ParameterState} from '../states/parameter.state';

export const parameterFeatureKey = 'parameters';

export const initialState: ParameterState = {
  parameters: [],
  loadingState: undefined,
};

export const parameterFeature = createFeature({
  name: parameterFeatureKey,
  reducer: createReducer(
    initialState,
    on(
      parameterActions.loadParameterForCollections,
      (state): ParameterState => ({
        ...state,
        loadingState: state.loadingState !== 'loaded' ? 'loading' : state.loadingState,
      }),
    ),
    on(
      parameterActions.setLoadedParameters,
      (state, {parameters}): ParameterState => ({
        ...state,
        parameters,
        loadingState: 'loaded',
      }),
    ),
  ),
});
