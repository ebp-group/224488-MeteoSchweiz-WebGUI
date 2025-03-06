import {createSelector} from '@ngrx/store';
import {selectParameterGroupStationMappings} from '../../parameter-station-mapping/selectors/parameter-group-station-mapping.selector';
import {selectCurrentStationState} from '../../stations/selectors/station.selector';
import {formFeature} from '../reducers/form.reducer';

export const selectCollectionsForSelectedStation = createSelector(
  formFeature.selectSelectedStationId,
  formFeature.selectSelectedParameterGroupId,
  selectCurrentStationState,
  selectParameterGroupStationMappings,
  (stationId, selectedParameterGroupId, {stations}, stationGroupMappings): string[] => {
    const stationGroupMappingCollections = stationGroupMappings.find(
      (mapping) => mapping.parameterGroupId === selectedParameterGroupId && mapping.stationId === stationId,
    )?.collections;
    const stationCollections = stations.find((station) => station.id === stationId)?.collections ?? [];
    if (stationGroupMappingCollections) {
      return stationCollections.filter((collection) => stationGroupMappingCollections.includes(collection));
    }
    return stationCollections;
  },
);
