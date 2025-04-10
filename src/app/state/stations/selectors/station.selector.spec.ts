import {collectionConfig} from '../../../shared/configs/collections.config';
import {ParameterGroupStationMapping} from '../../../shared/models/parameter-group-station-mapping';
import {Station} from '../../../shared/models/station';
import {
  selectPrioritizedUniqueStations,
  selectUniqueStationIdsFilteredBySelectedParameterGroups,
  selectUniqueStationsFilteredBySelectedParameterGroups,
} from './station.selector';

describe('Station Selectors', () => {
  describe('selectPrioritizedUniqueStations', () => {
    it('should not return duplicates', () => {
      const station: Station = {
        id: 'stationId1',
        name: 'stationName1',
        displayName: 'stationDisplayName1',
        coordinates: {latitude: 0, longitude: 0},
        collection: '',
        type: {
          en: 'station type',
          de: 'Stations typ',
          fr: 'french station type',
          it: 'italian station type',
        },
        elevation: 0,
        url: {
          de: 'url de',
          en: 'url en',
          fr: 'url fr',
          it: 'url it',
        },
      };
      const result = selectPrioritizedUniqueStations.projector(
        {
          stations: [station, station, station, station, station, station],
          loadingState: 'loaded',
        },
        'normal',
      );

      expect(result).toEqual([station]);
    });

    it('should pick the station with the collection that has the lowest index in the collection Config', () => {
      const stationOne: Station = {
        id: 'stationId1',
        name: 'stationName1',
        displayName: 'stationDisplayName1',
        coordinates: {latitude: 0, longitude: 0},
        collection: collectionConfig.collections.normal[0],
        type: {
          en: 'station type',
          de: 'Stations typ',
          fr: 'french station type',
          it: 'italian station type',
        },
        elevation: 0,
        url: {
          de: 'url de',
          en: 'url en',
          fr: 'url fr',
          it: 'url it',
        },
      };
      const stationTwo: Station = {
        id: 'stationId1',
        name: 'stationName1',
        displayName: 'stationDisplayName1',
        coordinates: {latitude: 0, longitude: 0},
        collection: collectionConfig.collections.normal[1],
        type: {
          en: 'station type',
          de: 'Stations typ',
          fr: 'french station type',
          it: 'italian station type',
        },
        elevation: 0,
        url: {
          de: 'url de',
          en: 'url en',
          fr: 'url fr',
          it: 'url it',
        },
      };
      const result = selectPrioritizedUniqueStations.projector(
        {
          stations: [stationTwo, stationOne, stationTwo],
          loadingState: 'loaded',
        },
        'normal',
      );

      expect(result).toEqual([stationOne]);
    });
  });

  describe('selectUniqueStationsFilteredBySelectedParameterGroups', () => {
    const stationOne: Station = {
      id: 'stationId1',
      name: 'stationName1',
      displayName: 'stationDisplayName1',
      coordinates: {latitude: 0, longitude: 0},
      collection: '',
      type: {
        en: 'station type',
        de: 'Stations typ',
        fr: 'french station type',
        it: 'italian station type',
      },
      elevation: 0,
      url: {
        de: 'url de',
        en: 'url en',
        fr: 'url fr',
        it: 'url it',
      },
    };
    const stationTwo: Station = {
      id: 'stationId2',
      name: 'stationName2',
      displayName: 'stationDisplayName2',
      coordinates: {latitude: 0, longitude: 0},
      collection: '',
      type: {
        en: 'station type',
        de: 'Stations typ',
        fr: 'french station type',
        it: 'italian station type',
      },
      elevation: 0,
      url: {
        de: 'url de',
        en: 'url en',
        fr: 'url fr',
        it: 'url it',
      },
    };
    const stationThree: Station = {
      id: 'stationId3',
      name: 'stationName3',
      displayName: 'stationDisplayName3',
      coordinates: {latitude: 0, longitude: 0},
      collection: '',
      type: {
        en: 'station type',
        de: 'Stations typ',
        fr: 'french station type',
        it: 'italian station type',
      },
      elevation: 0,
      url: {
        de: 'url de',
        en: 'url en',
        fr: 'url fr',
        it: 'url it',
      },
    };

    it('should return a filtered list of stations', () => {
      const stations: Station[] = [stationOne, stationTwo, stationThree];
      const selectedParameterGroupId = 'groupId1';
      const parameterGroupStationMappings: ParameterGroupStationMapping[] = [
        {parameterGroupId: 'groupId1', stationId: stationOne.id, collections: []},
        // duplicated entry => should be filtered out
        {parameterGroupId: 'groupId1', stationId: stationOne.id, collections: []},
        {parameterGroupId: 'groupId1', stationId: stationTwo.id, collections: []},
        {parameterGroupId: 'groupId2', stationId: stationThree.id, collections: []},
        {parameterGroupId: 'groupId2', stationId: 'nonExistingStationId', collections: []},
        {parameterGroupId: 'groupId3', stationId: stationOne.id, collections: []},
      ];

      const result = selectUniqueStationsFilteredBySelectedParameterGroups.projector(
        stations,
        selectedParameterGroupId,
        parameterGroupStationMappings,
      );

      expect(result).toEqual(jasmine.arrayWithExactContents([stationOne, stationTwo]));
    });

    it('should return an empty list if no stations are found', () => {
      const stations: Station[] = [];
      const selectedParameterGroupId = 'groupId1';
      const parameterGroupStationMappings: ParameterGroupStationMapping[] = [
        {parameterGroupId: 'groupId1', stationId: 'nonExistingStationId', collections: []},
      ];

      const result = selectUniqueStationsFilteredBySelectedParameterGroups.projector(
        stations,
        selectedParameterGroupId,
        parameterGroupStationMappings,
      );

      expect(result).toEqual([]);
    });

    it('should return an empty list if no parameter group station mappings are found', () => {
      const stations: Station[] = [stationOne];
      const selectedParameterGroupId = 'groupId1';
      const parameterGroupStationMappings: ParameterGroupStationMapping[] = [];

      const result = selectUniqueStationsFilteredBySelectedParameterGroups.projector(
        stations,
        selectedParameterGroupId,
        parameterGroupStationMappings,
      );

      expect(result).toEqual([]);
    });

    it('should return all stations if the selected parameter group ID is null', () => {
      const stations: Station[] = [stationOne, stationTwo, stationThree];
      const selectedParameterGroupId = null;
      const parameterGroupStationMappings: ParameterGroupStationMapping[] = [
        {parameterGroupId: 'groupId1', stationId: stationOne.id, collections: []},
      ];

      const result = selectUniqueStationsFilteredBySelectedParameterGroups.projector(
        stations,
        selectedParameterGroupId,
        parameterGroupStationMappings,
      );

      expect(result).toEqual(jasmine.arrayWithExactContents([stationOne, stationTwo, stationThree]));
    });
  });

  describe('selectUniqueStationIdsFilteredBySelectedParameterGroups', () => {
    it('should return a filtered list of stations and return the IDs', () => {
      const stationOne: Station = {
        id: 'stationId1',
        name: 'stationName1',
        displayName: 'stationDisplayName1',
        coordinates: {latitude: 0, longitude: 0},
        collection: '',
        type: {
          en: 'station type',
          de: 'Stations typ',
          fr: 'french station type',
          it: 'italian station type',
        },
        elevation: 0,
        url: {
          de: 'url de',
          en: 'url en',
          fr: 'url fr',
          it: 'url it',
        },
      };
      const stationTwo: Station = {
        id: 'stationId2',
        name: 'stationName2',
        displayName: 'stationDisplayName2',
        coordinates: {latitude: 0, longitude: 0},
        collection: '',
        type: {
          en: 'station type',
          de: 'Stations typ',
          fr: 'french station type',
          it: 'italian station type',
        },
        elevation: 0,
        url: {
          de: 'url de',
          en: 'url en',
          fr: 'url fr',
          it: 'url it',
        },
      };

      const result = selectUniqueStationIdsFilteredBySelectedParameterGroups.projector([stationOne, stationTwo]);

      expect(result).toEqual(jasmine.arrayWithExactContents([stationOne.id, stationTwo.id]));
    });
  });
});
