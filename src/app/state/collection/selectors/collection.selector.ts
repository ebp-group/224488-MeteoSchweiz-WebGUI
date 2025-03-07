import {createSelector} from '@ngrx/store';
import {LoadingState} from '../../../shared/models/loading-state';
import {selectCurrentParameterStationMappingState} from '../../parameter-station-mapping/selectors/parameter-group-station-mapping.selector';
import {selectCurrentParameterState} from '../../parameters/selectors/parameter.selector';
import {selectCurrentStationState} from '../../stations/selectors/station.selector';

/**
 * Selects the combined loading state of the current parameter, station and parameter-station-mapping state.
 */
export const selectCombinedLoadingState = createSelector(
  selectCurrentParameterState,
  selectCurrentStationState,
  selectCurrentParameterStationMappingState,
  ({loadingState: parameterLoadingState}, {loadingState: stationLoadingState}, {loadingState: mappingLoadingState}): LoadingState => {
    // return the combined loading state when all loading states are identical; `undefined` otherwise
    return parameterLoadingState === stationLoadingState && stationLoadingState === mappingLoadingState ? parameterLoadingState : undefined;
  },
);
