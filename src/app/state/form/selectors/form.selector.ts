import {createSelector} from '@ngrx/store';
import {selectParameterGroupStationMappings} from '../../parameter-station-mapping/selectors/parameter-group-station-mapping.selector';
import {selectCurrentStationState} from '../../stations/selectors/station.selector';
import {formFeature} from '../reducers/form.reducer';
import type {Station} from '../../../shared/models/station';

export const selectSelectedStationsFilteredByParameterGroupCollections = createSelector(
  formFeature.selectSelectedStationId,
  formFeature.selectSelectedParameterGroupId,
  selectCurrentStationState,
  selectParameterGroupStationMappings,
  (stationId, selectedParameterGroupId, {stations}, stationGroupMappings): Station[] => {
    const stationGroupMappingCollections = stationGroupMappings.find(
      (mapping) => mapping.parameterGroupId === selectedParameterGroupId && mapping.stationId === stationId,
    )?.collections;
    const selectedStations = stations.filter((station) => station.id === stationId);
    if (stationGroupMappingCollections) {
      return selectedStations.filter((station) => stationGroupMappingCollections.includes(station.collection));
    }
    return selectedStations;
  },
);
