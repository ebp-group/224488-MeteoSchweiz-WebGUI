import {createFeature, createReducer, on} from '@ngrx/store';
import {produce} from 'immer';
import {measurementDataTypes} from '../../../shared/models/measurement-data-type';
import {parameterActions} from '../actions/parameter.action';
import type {ParameterState, ParameterStateEntry} from '../states/parameter.state';

export const parameterFeatureKey = 'parameters';

const initialEntryState: ParameterStateEntry = {
  parameters: [],
  loadingState: undefined,
};

export const initialState: ParameterState = Object.fromEntries(measurementDataTypes.map((k) => [k, initialEntryState])) as ParameterState;

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
