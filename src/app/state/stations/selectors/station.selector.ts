import {createSelector} from '@ngrx/store';
import {Station} from '../../../shared/models/station';
import {formFeature} from '../../form/reducers/form.reducer';
import {selectParameterGroupStationMappings} from '../../parameter-station-mapping/selectors/parameter-group-station-mapping.selector';
import {stationFeature} from '../reducers/station.reducer';
import {StationStateEntry} from '../states/station.state';

export const selectCurrentStationState = createSelector(
  stationFeature.selectStationsState,
  formFeature.selectSelectedMeasurementDataType,
  (stationState, measurementDataType): StationStateEntry => stationState[measurementDataType],
);

export const selectStationsFilteredBySelectedParameterGroups = createSelector(
  selectCurrentStationState,
  formFeature.selectSelectedParameterGroupId,
  selectParameterGroupStationMappings,
  (stationState, parameterGroupId, parameterGroupStationMappings): Station[] => {
    if (!parameterGroupId) {
      return stationState.stations;
    }

    const matchingStationIds = parameterGroupStationMappings
      .filter((mapping) => mapping.parameterGroupId === parameterGroupId)
      .map((mapping) => mapping.stationId);
    return stationState.stations.filter((station) => matchingStationIds.includes(station.id));
  },
);

export const selectStationIdsFilteredBySelectedParameterGroups = createSelector(
  selectStationsFilteredBySelectedParameterGroups,
  (stations): string[] => stations.map((station) => station.id),
);
