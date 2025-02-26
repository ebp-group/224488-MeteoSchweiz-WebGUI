import {createSelector} from '@ngrx/store';
import {formFeature} from '../../form/reducers/form.reducer';
import {selectParameterGroupStationMappings} from '../../parameter-station-mapping/selectors/parameter-group-station-mapping.selector';
import {stationFeature} from '../reducers/station.reducer';

export const selectStationIdsFilteredBySelectedParameterGroups = createSelector(
  stationFeature.selectStations,
  formFeature.selectSelectedParameterGroupId,
  selectParameterGroupStationMappings,
  (stations, parameterGroupId, parameterGroupStationMappings): string[] => {
    if (!parameterGroupId) {
      return stations.map((station) => station.id);
    }

    const matchingStationIds = parameterGroupStationMappings
      .filter((mapping) => mapping.parameterGroupId === parameterGroupId)
      .map((mapping) => mapping.stationId);
    return stations.filter((station) => matchingStationIds.includes(station.id)).map((station) => station.id);
  },
);
