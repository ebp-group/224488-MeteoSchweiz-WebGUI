import {ParameterGroupStationMapping} from '../../../shared/models/parameter-group-station-mapping';
import {StationStateEntry} from '../../stations/states/station.state';
import {selectCollectionsForSelectedStation} from './form.selector';
import type {Station} from '../../../shared/models/station';

describe('Form selectors', () => {
  describe('selectCollectionsForSelectedStation', () => {
    const stationA: Station = {
      collections: ['a', 'b', 'c'],
      coordinates: {latitude: 0, longitude: 0},
      id: 'a',
      name: 'Test A',
      displayName: 'Test A (a)',
    };
    const stationState: StationStateEntry = {
      loadingState: 'loaded',
      stations: [stationA],
    };
    const parameterGroupStationMappings: ParameterGroupStationMapping[] = [
      {stationId: 'a', parameterGroupId: '1', collections: ['a']},
      {stationId: 'a', parameterGroupId: '2', collections: ['b']},
      {stationId: 'b', parameterGroupId: '1', collections: ['c']},
    ];

    it('should return an empty array if no station is selected', () => {
      const result = selectCollectionsForSelectedStation.projector(null, null, stationState, parameterGroupStationMappings);

      expect(result).toEqual([]);
    });

    it('should return all collections for a selected station if no parameter group is selected', () => {
      const result = selectCollectionsForSelectedStation.projector(stationA.id, null, stationState, parameterGroupStationMappings);

      expect(result).toEqual(jasmine.arrayWithExactContents(stationA.collections));
    });

    it('should filter the station collections based on the selected parameter group', () => {
      const result = selectCollectionsForSelectedStation.projector(stationA.id, '1', stationState, parameterGroupStationMappings);

      expect(result).toEqual(['a']);
    });
  });
});
