import {createSelector} from '@ngrx/store';
import {collectionConfig} from '../../../shared/configs/collections.config';
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

export const selectPrioritizedUniqueStations = createSelector(
  selectCurrentStationState,
  formFeature.selectSelectedMeasurementDataType,
  ({stations}, measurementDataType): Station[] => {
    const uniqueStationMap = stations.reduce<Map<string, Station>>((stationMap, station) => {
      const currentCollections = collectionConfig.collections[measurementDataType];
      const uniqueStation = stationMap.get(station.id);
      if (uniqueStation) {
        const uniqueStationIndex = currentCollections.findIndex((collection) => collection === uniqueStation.collection);
        const stationIndex = currentCollections.findIndex((collection) => collection === station.collection);
        if (stationIndex < uniqueStationIndex) {
          stationMap.set(station.id, station);
        }
      } else {
        stationMap.set(station.id, station);
      }
      return stationMap;
    }, new Map<string, Station>());
    return [...uniqueStationMap.values()];
  },
);

export const selectStationsFilteredBySelectedParameterGroups = createSelector(
  selectPrioritizedUniqueStations,
  formFeature.selectSelectedParameterGroupId,
  selectParameterGroupStationMappings,
  (stations, parameterGroupId, parameterGroupStationMappings): Station[] => {
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
