import {ParameterGroupStationMapping} from '../../../shared/models/parameter-group-station-mapping';
import {Station} from '../../../shared/models/station';
import {selectStationIdsFilteredBySelectedParameterGroups, selectStationsFilteredBySelectedParameterGroups} from './station.selector';

describe('Station Selectors', () => {
  describe('selectStationsFilteredBySelectedParameterGroups', () => {
    const stationOne: Station = {id: 'stationId1', name: 'stationName1', coordinates: {latitude: 0, longitude: 0}};
    const stationTwo: Station = {id: 'stationId2', name: 'stationName2', coordinates: {latitude: 0, longitude: 0}};
    const stationThree: Station = {id: 'stationId3', name: 'stationName3', coordinates: {latitude: 0, longitude: 0}};

    it('should return a filtered list of stations', () => {
      const stations: Station[] = [stationOne, stationTwo, stationThree];
      const selectedParameterGroupId = 'groupId1';
      const parameterGroupStationMappings: ParameterGroupStationMapping[] = [
        {parameterGroupId: 'groupId1', stationId: stationOne.id},
        // duplicated entry => should be filtered out
        {parameterGroupId: 'groupId1', stationId: stationOne.id},
        {parameterGroupId: 'groupId1', stationId: stationTwo.id},
        {parameterGroupId: 'groupId2', stationId: stationThree.id},
        {parameterGroupId: 'groupId2', stationId: 'nonExistingStationId'},
        {parameterGroupId: 'groupId3', stationId: stationOne.id},
      ];

      const result = selectStationsFilteredBySelectedParameterGroups.projector(
        {stations, loadingState: 'loaded'},
        selectedParameterGroupId,
        parameterGroupStationMappings,
      );

      expect(result).toEqual(jasmine.arrayWithExactContents([stationOne, stationTwo]));
    });

    it('should return an empty list if no stations are found', () => {
      const stations: Station[] = [];
      const selectedParameterGroupId = 'groupId1';
      const parameterGroupStationMappings: ParameterGroupStationMapping[] = [
        {parameterGroupId: 'groupId1', stationId: 'nonExistingStationId'},
      ];

      const result = selectStationsFilteredBySelectedParameterGroups.projector(
        {stations, loadingState: 'loaded'},
        selectedParameterGroupId,
        parameterGroupStationMappings,
      );

      expect(result).toEqual([]);
    });

    it('should return an empty list if no parameter group station mappings are found', () => {
      const stations: Station[] = [stationOne];
      const selectedParameterGroupId = 'groupId1';
      const parameterGroupStationMappings: ParameterGroupStationMapping[] = [];

      const result = selectStationsFilteredBySelectedParameterGroups.projector(
        {stations, loadingState: 'loaded'},
        selectedParameterGroupId,
        parameterGroupStationMappings,
      );

      expect(result).toEqual([]);
    });

    it('should return all stations if the selected parameter group ID is null', () => {
      const stations: Station[] = [stationOne, stationTwo, stationThree];
      const selectedParameterGroupId = null;
      const parameterGroupStationMappings: ParameterGroupStationMapping[] = [{parameterGroupId: 'groupId1', stationId: stationOne.id}];

      const result = selectStationsFilteredBySelectedParameterGroups.projector(
        {stations, loadingState: 'loaded'},
        selectedParameterGroupId,
        parameterGroupStationMappings,
      );

      expect(result).toEqual(jasmine.arrayWithExactContents([stationOne, stationTwo, stationThree]));
    });
  });

  describe('selectStationsFilteredBySelectedParameterGroups', () => {
    it('should return a filtered list of stations and return the IDs', () => {
      const stationOne: Station = {id: 'stationId1', name: 'stationName1', coordinates: {latitude: 0, longitude: 0}};
      const stationTwo: Station = {id: 'stationId2', name: 'stationName2', coordinates: {latitude: 0, longitude: 0}};

      const result = selectStationIdsFilteredBySelectedParameterGroups.projector([stationOne, stationTwo]);

      expect(result).toEqual(jasmine.arrayWithExactContents([stationOne.id, stationTwo.id]));
    });
  });
});
