import {Parameter} from '../../../shared/models/parameter';
import {ParameterGroupStationMapping} from '../../../shared/models/parameter-group-station-mapping';
import {ParameterStationMapping} from '../../../shared/models/parameter-station-mapping';
import {selectParameterGroupStationMappings} from './parameter-group-station-mapping.selector';

describe('ParameterGroupStationMapping Selectors', () => {
  describe('selectParameterGroupStationMappings', () => {
    const parameterOne: Parameter = {
      id: 'paramId1',
      group: {en: 'groupId1', de: '', fr: '', it: ''},
    };
    const parameterTwo: Parameter = {
      id: 'paramId2',
      group: {en: 'groupId1', de: '', fr: '', it: ''},
    };
    const parameterThree: Parameter = {
      id: 'paramId3',
      group: {en: 'groupId2', de: '', fr: '', it: ''},
    };
    const parameterFour: Parameter = {
      id: 'paramId4',
      group: {en: 'groupId2', de: '', fr: '', it: ''},
    };

    it('should return unique parameter group station mappings', () => {
      const parameters: Parameter[] = [parameterOne, parameterTwo, parameterThree, parameterFour];
      const parameterStationMappings: ParameterStationMapping[] = [
        {parameterId: 'paramId1', stationId: 'stationId1', collection: 'a'},
        // duplicated entry => should be filtered out
        {parameterId: 'paramId1', stationId: 'stationId1', collection: 'b'},
        {parameterId: 'paramId2', stationId: 'stationId1', collection: 'a'},
        {parameterId: 'paramId3', stationId: 'stationId2', collection: 'a'},
        {parameterId: 'nonExistingParam', stationId: 'stationId1', collection: 'a'},
      ];

      const result = selectParameterGroupStationMappings.projector(
        {parameterStationMappings, loadingState: 'loaded'},
        {parameters, loadingState: 'loaded'},
      );

      expect(result).toEqual(
        jasmine.arrayWithExactContents([
          {parameterGroupId: 'groupId1', stationId: 'stationId1', collections: ['a', 'b']},
          {parameterGroupId: 'groupId2', stationId: 'stationId2', collections: ['a']},
        ] satisfies ParameterGroupStationMapping[]),
      );
    });

    it('should return empty array if no parameter groups were given', () => {
      const parameterStationMappings: ParameterStationMapping[] = [];
      const parameters: Parameter[] = [parameterOne];

      const result = selectParameterGroupStationMappings.projector(
        {parameterStationMappings, loadingState: 'loaded'},
        {parameters, loadingState: 'loaded'},
      );

      expect(result).toEqual([]);
    });

    it('should return empty array if no parameters were given', () => {
      const parameterStationMappings: ParameterStationMapping[] = [
        {parameterId: 'nonExistingParam', stationId: 'stationId1', collection: ''},
      ];
      const parameters: Parameter[] = [];

      const result = selectParameterGroupStationMappings.projector(
        {parameterStationMappings, loadingState: 'loaded'},
        {parameters, loadingState: 'loaded'},
      );

      expect(result).toEqual([]);
    });
  });
});
