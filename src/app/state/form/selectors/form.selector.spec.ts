import {ParameterGroupStationMapping} from '../../../shared/models/parameter-group-station-mapping';
import {StationStateEntry} from '../../stations/states/station.state';
import {selectSelectedStationsFilteredByParameterGroupCollections} from './form.selector';
import type {Station} from '../../../shared/models/station';

describe('Form selectors', () => {
  describe('selectSelectedStationsFilteredByParameterGroupCollections', () => {
    const baseStation: Omit<Station, 'collection' | 'type'> = {
      coordinates: {latitude: 0, longitude: 0},
      id: 'a',
      name: 'Test A',
      displayName: 'Test A (a)',
    };
    const stationA: Station = {...baseStation, collection: 'a', type: {de: 'a', en: 'a', fr: 'a', it: 'a'}};
    const stationB: Station = {...baseStation, collection: 'b', type: {de: 'b', en: 'b', fr: 'b', it: 'b'}};
    const stationC: Station = {...baseStation, collection: 'c', type: {de: 'c', en: 'c', fr: 'c', it: 'c'}};
    const wrongStation: Station = {...baseStation, id: 'b', collection: 'c', type: {de: 'c', en: 'c', fr: 'c', it: 'c'}};

    const stationState: StationStateEntry = {
      loadingState: 'loaded',
      stations: [stationA, stationB, stationC, wrongStation],
    };
    const parameterGroupStationMappings: ParameterGroupStationMapping[] = [
      {stationId: 'a', parameterGroupId: '1', collections: ['a']},
      {stationId: 'a', parameterGroupId: '2', collections: ['b']},
      {stationId: 'b', parameterGroupId: '1', collections: ['c']},
    ];

    it('should return an empty array if no station is selected', () => {
      const result = selectSelectedStationsFilteredByParameterGroupCollections.projector(
        null,
        null,
        stationState,
        parameterGroupStationMappings,
      );

      expect(result).toEqual([]);
    });

    it('should return all stations for a selected station id if no parameter group is selected', () => {
      const result = selectSelectedStationsFilteredByParameterGroupCollections.projector(
        baseStation.id,
        null,
        stationState,
        parameterGroupStationMappings,
      );

      expect(result).toEqual(jasmine.arrayWithExactContents([stationA, stationB, stationC] satisfies Station[]));
    });

    it('should filter the stations based on the selected parameter group', () => {
      const result = selectSelectedStationsFilteredByParameterGroupCollections.projector(
        baseStation.id,
        '1',
        stationState,
        parameterGroupStationMappings,
      );

      expect(result).toEqual([stationA] satisfies Station[]);
    });
  });
});
