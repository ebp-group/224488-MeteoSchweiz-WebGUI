import {createFeature, createReducer, on} from '@ngrx/store';
import {produce} from 'immer';
import {parameterActions} from '../actions/parameter.action';
import type {ParameterState, ParameterStateEntry} from '../states/parameter.state';

export const parameterFeatureKey = 'parameters';

const initialEntryState: ParameterStateEntry = {
  parameters: [],
  loadingState: undefined,
};

export const initialState: ParameterState = {
  homogenous: {...initialEntryState},
  normal: {...initialEntryState},
};

export const parameterFeature = createFeature({
  name: parameterFeatureKey,
  reducer: createReducer(
    initialState,
    on(
      parameterActions.loadParametersForCollections,
      produce((draft, {measurementDataType}) => {
        const state = draft[measurementDataType];
        state.loadingState = state.loadingState !== 'loaded' ? 'loading' : state.loadingState;
      }),
    ),
    on(
      parameterActions.setLoadedParameters,
      produce((draft, {measurementDataType, parameters}) => {
        const state = draft[measurementDataType];
        state.parameters = parameters;
        state.loadingState = 'loaded';
      }),
    ),
    on(
      parameterActions.setParameterLoadingError,
      produce((draft, {measurementDataType}) => {
        draft[measurementDataType] = {...initialEntryState, loadingState: 'error'};
      }),
    ),
  ),
});
