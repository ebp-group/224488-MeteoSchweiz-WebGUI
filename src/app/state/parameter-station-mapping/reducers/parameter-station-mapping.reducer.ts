import {createFeature, createReducer, on} from '@ngrx/store';
import {parameterStationMappingActions} from '../actions/parameter-station-mapping.action';
import {ParameterStationMappingState} from '../states/parameter-station-mapping.state';

export const parameterStationMappingFeatureKey = 'parameterStationMappings';

export const initialState: ParameterStationMappingState = {
  parameterStationMappings: [],
  loadingState: undefined,
};

export const parameterStationMappingFeature = createFeature({
  name: parameterStationMappingFeatureKey,
  reducer: createReducer(
    initialState,
    on(
      parameterStationMappingActions.loadParameterStationMappingsForCollections,
      (state): ParameterStationMappingState => ({
        ...state,
        loadingState: state.loadingState !== 'loaded' ? 'loading' : state.loadingState,
      }),
    ),
    on(
      parameterStationMappingActions.setLoadedParameterStationMappings,
      (state, {parameterStationMappings}): ParameterStationMappingState => ({
        ...state,
        parameterStationMappings,
        loadingState: 'loaded',
      }),
    ),
    on(parameterStationMappingActions.setParameterStationMappingLoadingError, (): ParameterStationMappingState => {
      return {...initialState, loadingState: 'error'};
    }),
  ),
});
