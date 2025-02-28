import {createSelector} from '@ngrx/store';
import {formFeature} from '../../form/reducers/form.reducer';
import {selectParameterGroupStationMappings} from '../../parameter-station-mapping/selectors/parameter-group-station-mapping.selector';
import {stationFeature} from '../reducers/station.reducer';
import {StationStateEntry} from '../states/station.state';

export const selectCurrentStationState = createSelector(
  stationFeature.selectStationsState,
  formFeature.selectSelectedMeasurementDataType,
  (stationState, measurementDataType): StationStateEntry => stationState[measurementDataType],
);

export const selectStationIdsFilteredBySelectedParameterGroups = createSelector(
  selectCurrentStationState,
  formFeature.selectSelectedParameterGroupId,
  selectParameterGroupStationMappings,
  (stationState, parameterGroupId, parameterGroupStationMappings): string[] => {
    if (!parameterGroupId) {
      return stationState.stations.map((station) => station.id);
    }

    const matchingStationIds = parameterGroupStationMappings
      .filter((mapping) => mapping.parameterGroupId === parameterGroupId)
      .map((mapping) => mapping.stationId);
    return stationState.stations.filter((station) => matchingStationIds.includes(station.id)).map((station) => station.id);
  },
);
