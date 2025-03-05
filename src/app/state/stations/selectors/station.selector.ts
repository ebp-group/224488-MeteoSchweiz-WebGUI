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
  ({stations}, parameterGroupId, parameterGroupStationMappings): Station[] => {
    if (!parameterGroupId) {
      return stations;
    }

    const matchingStationIdsList = parameterGroupStationMappings
      .filter((mapping) => mapping.parameterGroupId === parameterGroupId)
      .map((mapping) => mapping.stationId);
    const matchingStationIds = new Set(matchingStationIdsList);
    return stations.filter((station) => matchingStationIds.has(station.id));
  },
);

export const selectStationIdsFilteredBySelectedParameterGroups = createSelector(
  selectStationsFilteredBySelectedParameterGroups,
  (stations): string[] => stations.map((station) => station.id),
);
