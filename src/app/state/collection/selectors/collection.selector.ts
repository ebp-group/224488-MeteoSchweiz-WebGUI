import {createSelector} from '@ngrx/store';
import {LoadingState} from '../../../shared/models/loading-state';
import {formFeature} from '../../form/reducers/form.reducer';
import {selectCurrentParameterStationMappingState} from '../../parameter-station-mapping/selectors/parameter-group-station-mapping.selector';
import {selectCurrentParameterState} from '../../parameters/selectors/parameter.selector';
import {selectCurrentStationState} from '../../stations/selectors/station.selector';
import {collectionFeature} from '../reducers/collection.reducer';
import {CollectionStateEntry} from '../states/collection.state';

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

export const selectCurrentCollectionState = createSelector(
  collectionFeature.selectCollectionState,
  formFeature.selectSelectedMeasurementDataType,
  (collectionState, measurementDataType): CollectionStateEntry => collectionState[measurementDataType],
);
