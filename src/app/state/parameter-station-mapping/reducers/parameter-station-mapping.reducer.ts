import {createFeature, createReducer, on} from '@ngrx/store';
import {produce} from 'immer';
import {measurementDataTypes} from '../../../shared/models/measurement-data-type';
import {parameterStationMappingActions} from '../actions/parameter-station-mapping.action';
import {ParameterStationMappingState, ParameterStationMappingStateEntry} from '../states/parameter-station-mapping.state';

export const parameterStationMappingFeatureKey = 'parameterStationMappings';

export const initialEntryState: ParameterStationMappingStateEntry = {
  parameterStationMappings: [],
  loadingState: undefined,
};

export const initialState: ParameterStationMappingState = Object.fromEntries(
  measurementDataTypes.map((k) => [k, initialEntryState]),
) as ParameterStationMappingState;

export const parameterStationMappingFeature = createFeature({
  name: parameterStationMappingFeatureKey,
  reducer: createReducer(
    initialState,
    on(
      parameterStationMappingActions.loadParameterStationMappingsForCollections,
      produce((draft, {measurementDataType}) => {
        const state = draft[measurementDataType];
        state.loadingState = state.loadingState !== 'loaded' ? 'loading' : state.loadingState;
      }),
    ),
    on(
      parameterStationMappingActions.setLoadedParameterStationMappings,
      produce((draft, {measurementDataType, parameterStationMappings}) => {
        const state = draft[measurementDataType];
        state.parameterStationMappings = parameterStationMappings;
        state.loadingState = 'loaded';
      }),
    ),
    on(
      parameterStationMappingActions.setParameterStationMappingLoadingError,
      produce((draft, {measurementDataType}) => {
        draft[measurementDataType] = {...initialEntryState, loadingState: 'error'};
      }),
    ),
  ),
});
