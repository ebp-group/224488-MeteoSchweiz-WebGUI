import {selectParameterGroups} from './parameter.selector';
import type {Parameter} from '../../../shared/models/parameter';

describe('Parameter Selectors', () => {
  describe('selectParameterGroups', () => {
    it('should extract all unique parameter groups from stored parameters', () => {
      const baseParameter: Omit<Parameter, 'group'> = {
        id: 'test-parameter-id',
        description: {de: 'test-description', en: 'test-description', fr: 'test-description', it: 'test-description'},
      };
      const groupA: Parameter['group'] = {de: 'A', en: 'A', fr: 'A', it: 'A'};
      const groupB: Parameter['group'] = {de: 'B', en: 'B', fr: 'B', it: 'B'};
      const groupC: Parameter['group'] = {de: 'C', en: 'C', fr: 'C', it: 'C'};
      const parameters: Parameter[] = [
        {...baseParameter, group: groupC},
        {...baseParameter, group: groupC},
        {...baseParameter, group: groupB},
        {...baseParameter, group: groupA},
        {...baseParameter, group: groupB},
        {...baseParameter, group: groupC},
      ];
      const result = selectParameterGroups.projector(parameters);

      expect(result).toEqual(
        jasmine.arrayWithExactContents([
          {name: groupA, id: groupA.en},
          {name: groupB, id: groupB.en},
          {name: groupC, id: groupC.en},
        ]),
      );
    });

    it('should use english as the id of a group', () => {
      const parameters: Parameter[] = [
        {
          id: 'test-parameter-id',
          description: {de: 'test-description', en: 'test-description', fr: 'test-description', it: 'test-description'},
          group: {de: 'test-group', en: 'test-group', fr: 'test-group', it: 'test-group'},
        },
      ];

      const result = selectParameterGroups.projector(parameters);

      expect(result[0].id).toBe(parameters[0].group.en);
    });
  });
});
