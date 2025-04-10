import {CollectionAsset} from '../../../shared/models/collection-assets';
import {LocalizedParameterGroup} from '../../../shared/models/parameter';
import {ParameterGroupStationMapping} from '../../../shared/models/parameter-group-station-mapping';
import {StationWithParameterGroups} from '../../../shared/models/station-with-parameter-groups';
import {StationStateEntry} from '../../stations/states/station.state';
import {
  selectSelectedCollectionMetaAssets,
  selectSelectedStationForCollection,
  selectSelectedStationsFilteredBySelectedParameterGroup,
  selectSelectedStationWithParameterGroup,
} from './form.selector';
import type {Station} from '../../../shared/models/station';

describe('Form selectors', () => {
  const baseStation: Omit<Station, 'collection' | 'type'> = {
    coordinates: {latitude: 0, longitude: 0},
    id: 'a',
    name: 'Test A',
    displayName: 'Test A (a)',
    elevation: 0,
    url: {
      de: 'url de',
      en: 'url en',
      fr: 'url fr',
      it: 'url it',
    },
  };
  const stationAA: Station = {...baseStation, collection: 'a', type: {de: 'a', en: 'a', fr: 'a', it: 'a'}};
  const stationAB: Station = {...baseStation, collection: 'b', type: {de: 'b', en: 'b', fr: 'b', it: 'b'}};
  const stationAC: Station = {...baseStation, collection: 'c', type: {de: 'c', en: 'c', fr: 'c', it: 'c'}};
  const wrongStation: Station = {...baseStation, id: 'b', collection: 'c', type: {de: 'c', en: 'c', fr: 'c', it: 'c'}};

  const stationState: StationStateEntry = {
    loadingState: 'loaded',
    stations: [stationAA, stationAB, stationAC, wrongStation],
  };

  const parameterGroupOne: LocalizedParameterGroup = {id: '1', name: {de: '', en: '', fr: '', it: ''}, displayName: ''};
  const parameterGroupTwo: LocalizedParameterGroup = {id: '2', name: {de: '', en: '', fr: '', it: ''}, displayName: ''};
  const parameterGroupThree: LocalizedParameterGroup = {id: '3', name: {de: '', en: '', fr: '', it: ''}, displayName: ''};
  const parameterGroups: LocalizedParameterGroup[] = [parameterGroupOne, parameterGroupTwo, parameterGroupThree];

  const parameterGroupStationMappings: ParameterGroupStationMapping[] = [
    {stationId: 'a', parameterGroupId: '1', collections: ['a']},
    {stationId: 'a', parameterGroupId: '2', collections: ['b']},
    {stationId: 'b', parameterGroupId: '1', collections: ['c']},
  ];

  describe('selectSelectedStationWithParameterGroup', () => {
    it('should return an empty array if no station is selected', () => {
      const result = selectSelectedStationWithParameterGroup.projector(null, stationState, parameterGroups, parameterGroupStationMappings);

      expect(result).toEqual([]);
    });

    it('should return the stations for the selected station id with the mapped parameter groups', () => {
      const result = selectSelectedStationWithParameterGroup.projector(
        baseStation.id,
        stationState,
        parameterGroups,
        parameterGroupStationMappings,
      );

      expect(result).toEqual(
        jasmine.arrayWithExactContents([
          {...stationAA, parameterGroups: [parameterGroupOne]},
          {...stationAB, parameterGroups: [parameterGroupTwo]},
          {...stationAC, parameterGroups: []},
        ] satisfies StationWithParameterGroups[]),
      );
    });
  });

  describe('selectSelectedStationWithParameterGroupFilteredBySelectedParameterGroup', () => {
    it('should filter the stations based on the selected parameter group', () => {
      const result = selectSelectedStationsFilteredBySelectedParameterGroup.projector(
        [
          {...stationAA, parameterGroups: [parameterGroupOne]},
          {...stationAB, parameterGroups: [parameterGroupTwo]},
          {...stationAC, parameterGroups: []},
        ],
        '1',
      );

      expect(result).toEqual([{...stationAA, parameterGroups: [parameterGroupOne]}]);
    });
  });

  describe('selectSelectedStationForCollection', () => {
    it('should return a single station if stationId and collection is selected', () => {
      const stationsWithParameterGroups = [
        {...stationAA, parameterGroups: [parameterGroupOne]},
        {...stationAB, parameterGroups: [parameterGroupOne]},
        {...stationAC, parameterGroups: [parameterGroupOne]},
        {...wrongStation, parameterGroups: [parameterGroupOne]},
      ];
      const result = selectSelectedStationForCollection.projector(stationsWithParameterGroups, 'a', 'a');

      expect(result).toEqual({...stationAA, parameterGroups: [parameterGroupOne]});
    });
  });

  describe('selectSelectedCollectionMetaAssets', () => {
    const collection = 'a';
    const stationMetaAsset: CollectionAsset = {
      filename: '',
      url: '',
      collection: collection,
      metaFileType: 'station',
    };
    const parameterMetaAsset: CollectionAsset = {
      filename: '',
      url: '',
      collection: collection,
      metaFileType: 'parameter',
    };
    const dataInventoryMetaAsset: CollectionAsset = {
      filename: '',
      url: '',
      collection: collection,
      metaFileType: 'dataInventory',
    };
    const assets: CollectionAsset[] = [
      stationMetaAsset,
      parameterMetaAsset,
      dataInventoryMetaAsset,
      {...stationMetaAsset, collection: 'b'},
      {...parameterMetaAsset, collection: 'b'},
      {...stationMetaAsset, collection: 'c'},
      {...dataInventoryMetaAsset, collection: 'c'},
    ];
    it('should return meta assets for each metaFileType for the selected collection id', () => {
      const result = selectSelectedCollectionMetaAssets.projector({collectionAssets: assets, loadingState: 'loaded'}, collection);

      expect(result).toEqual({
        station: stationMetaAsset,
        parameter: parameterMetaAsset,
        dataInventory: dataInventoryMetaAsset,
      });
    });

    it('should return undefined if no collection is selected', () => {
      const result = selectSelectedCollectionMetaAssets.projector({collectionAssets: assets, loadingState: 'loaded'}, null);

      expect(result).toBe(undefined);
    });
  });
});
