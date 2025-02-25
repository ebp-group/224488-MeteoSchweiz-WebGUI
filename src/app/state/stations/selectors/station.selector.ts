import {createSelector} from '@ngrx/store';
import {Station} from '../../../shared/models/station';
import {formFeature} from '../../form/reducers/form.reducer';
import {selectParameterGroupStationMappings} from '../../parameter-station-mapping/selectors/parameter-group-station-mapping.selector';
import {stationFeature} from '../reducers/station.reducer';

export const selectStationsFilteredByParameterGroups = createSelector(
  stationFeature.selectStations,
  formFeature.selectSelectedParameterGroupId,
  selectParameterGroupStationMappings,
  (stations, parameterGroupId, parameterGroupStationMappings): Station[] => {
    if (!parameterGroupId) {
      return stations;
    }

    const matchingStationIds = parameterGroupStationMappings
      .filter((mapping) => mapping.parameterGroupId === parameterGroupId)
      .map((mapping) => mapping.stationId);
    return stations.filter((station) => matchingStationIds.includes(station.id));
  },
);
