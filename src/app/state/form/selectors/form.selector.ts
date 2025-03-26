import {createSelector} from '@ngrx/store';
import {CollectionMetaAssets} from '../../../shared/models/collection-meta-assets';
import {StationWithParameterGroups} from '../../../shared/models/station-with-parameter-groups';
import {selectCurrentCollectionState} from '../../collection/selectors/collection.selector';
import {selectParameterGroupStationMappings} from '../../parameter-station-mapping/selectors/parameter-group-station-mapping.selector';
import {selectParameterGroupsSortedByLocalizedName} from '../../parameters/selectors/parameter.selector';
import {selectCurrentStationState} from '../../stations/selectors/station.selector';
import {formFeature} from '../reducers/form.reducer';

export const selectSelectedStationWithParameterGroup = createSelector(
  formFeature.selectSelectedStationId,
  selectCurrentStationState,
  selectParameterGroupsSortedByLocalizedName,
  selectParameterGroupStationMappings,
  (stationId, {stations}, parameterGroups, parameterGroupStationMapping): StationWithParameterGroups[] =>
    stations
      .filter((station) => station.id === stationId)
      .map((station) => ({
        ...station,
        parameterGroups: parameterGroups.filter((group) =>
          parameterGroupStationMapping.some(
            (mapping) =>
              mapping.parameterGroupId === group.id && mapping.stationId === stationId && mapping.collections.includes(station.collection),
          ),
        ),
      })),
);

export const selectSelectedStationWithParameterGroupsFilteredBySelectedParameterGroup = createSelector(
  selectSelectedStationWithParameterGroup,
  formFeature.selectSelectedParameterGroupId,
  (stations, selectedParameterGroupId): StationWithParameterGroups[] => {
    return selectedParameterGroupId === null
      ? stations
      : stations.filter((station) => station.parameterGroups.some((group) => group.id === selectedParameterGroupId));
  },
);

export const selectSelectedStationForCollection = createSelector(
  selectSelectedStationWithParameterGroupsFilteredBySelectedParameterGroup,
  formFeature.selectSelectedStationId,
  formFeature.selectSelectedCollection,
  (stations, stationId, collection): StationWithParameterGroups | undefined =>
    stations.find((station) => station.id === stationId && station.collection === collection),
);

export const selectSelectedCollectionMetaAssets = createSelector(
  selectCurrentCollectionState,
  formFeature.selectSelectedCollection,
  (collectionState, collection): CollectionMetaAssets | undefined => {
    if (collection == null) {
      return undefined;
    }
    const assets = collectionState.collectionAssets.filter((asset) => asset.collection === collection);
    const parameterAsset = assets.find((asset) => asset.metaFileType === 'parameter');
    const stationAsset = assets.find((asset) => asset.metaFileType === 'station');
    const dataInventoryAsset = assets.find((asset) => asset.metaFileType === 'dataInventory');

    if (!parameterAsset || !stationAsset || !dataInventoryAsset) {
      return undefined;
    }

    return {
      parameter: parameterAsset,
      station: stationAsset,
      dataInventory: dataInventoryAsset,
    };
  },
);
