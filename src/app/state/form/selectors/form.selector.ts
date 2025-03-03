import {createSelector} from '@ngrx/store';
import {selectParameterGroupStationMappings} from '../../parameter-station-mapping/selectors/parameter-group-station-mapping.selector';
import {selectCurrentStationState} from '../../stations/selectors/station.selector';
import {formFeature} from '../reducers/form.reducer';

export const selectCollectionsForSelectedStation = createSelector(
  formFeature.selectSelectedStationId,
  formFeature.selectSelectedParameterGroupId,
  selectCurrentStationState,
  selectParameterGroupStationMappings,
  (stationId, selectedParameterGroupId, stationState, stationGroupMapping) => {
    const collectionsForMappingForStation = stationGroupMapping.find(
      (mapping) => mapping.parameterGroupId === selectedParameterGroupId && mapping.stationId === stationId,
    )?.collections;
    const stationCollections = stationState.stations.find((station) => station.id === stationId)?.collections ?? [];
    if (collectionsForMappingForStation) {
      return stationCollections.filter((collection) => collectionsForMappingForStation.includes(collection));
    }
    return stationCollections;
  },
);
