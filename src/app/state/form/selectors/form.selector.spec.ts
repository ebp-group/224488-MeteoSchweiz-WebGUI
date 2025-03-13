import {ParameterGroup} from '../../../shared/models/parameter';
import {ParameterGroupStationMapping} from '../../../shared/models/parameter-group-station-mapping';
import {StationWithParameterGroups} from '../../../shared/models/station-with-parameter-groups';
import {StationStateEntry} from '../../stations/states/station.state';
import {
  selectSelectedStation,
  selectSelectedStationWithParameterGroup,
  selectSelectedStationWithParameterGroupsFilteredBySelectedParameterGroup,
} from './form.selector';
import type {Station} from '../../../shared/models/station';

describe('Form selectors', () => {
  const baseStation: Omit<Station, 'collection' | 'type'> = {
    coordinates: {latitude: 0, longitude: 0},
    id: 'a',
    name: 'Test A',
    displayName: 'Test A (a)',
  };
  const stationAA: Station = {...baseStation, collection: 'a', type: {de: 'a', en: 'a', fr: 'a', it: 'a'}};
  const stationAB: Station = {...baseStation, collection: 'b', type: {de: 'b', en: 'b', fr: 'b', it: 'b'}};
  const stationAC: Station = {...baseStation, collection: 'c', type: {de: 'c', en: 'c', fr: 'c', it: 'c'}};
  const wrongStation: Station = {...baseStation, id: 'b', collection: 'c', type: {de: 'c', en: 'c', fr: 'c', it: 'c'}};

  const stationState: StationStateEntry = {
    loadingState: 'loaded',
    stations: [stationAA, stationAB, stationAC, wrongStation],
  };

  const parameterGroupOne: ParameterGroup = {id: '1', name: {de: '', en: '', fr: '', it: ''}};
  const parameterGroupTwo: ParameterGroup = {id: '2', name: {de: '', en: '', fr: '', it: ''}};
  const parameterGroupThree: ParameterGroup = {id: '3', name: {de: '', en: '', fr: '', it: ''}};
  const parameterGroups: ParameterGroup[] = [parameterGroupOne, parameterGroupTwo, parameterGroupThree];

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
      const result = selectSelectedStationWithParameterGroupsFilteredBySelectedParameterGroup.projector(
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

  describe('selectSelectedStation', () => {
    it('should return a single station if stationId and collection is selected', () => {
      const stationsWithParameterGroups = [
        {...stationAA, parameterGroups: [parameterGroupOne]},
        {...stationAB, parameterGroups: [parameterGroupOne]},
        {...stationAC, parameterGroups: [parameterGroupOne]},
        {...wrongStation, parameterGroups: [parameterGroupOne]},
      ];
      const result = selectSelectedStation.projector(stationsWithParameterGroups, 'a', 'a');

      expect(result).toEqual({...stationAA, parameterGroups: [parameterGroupOne]});
    });
  });
});
