import {initialState} from '../reducers/parameter.reducer';
import {ParameterState} from '../states/parameter.state';
import {selectCurrentParameterState, selectParameterGroups, selectParameterGroupsSortedByLocalizedName} from './parameter.selector';
import type {Parameter, ParameterGroup} from '../../../shared/models/parameter';

describe('Parameter Selectors', () => {
  const parameters: Parameter[] = [
    {
      id: 'test-parameter-id',
      description: {de: 'test-description', en: 'test-description', fr: 'test-description', it: 'test-description'},
      group: {de: 'test-group', en: 'test-group', fr: 'test-group', it: 'test-group'},
    },
  ];
  describe('selectParameterGroups', () => {
    it('should extract all unique parameter groups from stored parameters', () => {
      const baseParameter: Omit<Parameter, 'group'> = {
        id: 'test-parameter-id',
        description: {de: 'test-description', en: 'test-description', fr: 'test-description', it: 'test-description'},
      };
      const groupA: Parameter['group'] = {de: 'A', en: 'A', fr: 'A', it: 'A'};
      const groupB: Parameter['group'] = {de: 'B', en: 'B', fr: 'B', it: 'B'};
      const groupC: Parameter['group'] = {de: 'C', en: 'C', fr: 'C', it: 'C'};
      const parametersWithGroups: Parameter[] = [
        {...baseParameter, group: groupC},
        {...baseParameter, group: groupC},
        {...baseParameter, group: groupB},
        {...baseParameter, group: groupA},
        {...baseParameter, group: groupB},
        {...baseParameter, group: groupC},
      ];
      const result = selectParameterGroups.projector({parameters: parametersWithGroups, loadingState: 'loaded'});

      expect(result).toEqual(
        jasmine.arrayWithExactContents([
          {name: groupA, id: groupA.en},
          {name: groupB, id: groupB.en},
          {name: groupC, id: groupC.en},
        ]),
      );
    });

    it('should use english as the id of a group', () => {
      const result = selectParameterGroups.projector({parameters, loadingState: 'loaded'});

      expect(result[0].id).toBe(parameters[0].group.en);
    });
  });

  describe('selectCurrentParameterState', () => {
    let state: ParameterState;
    beforeEach(() => {
      state = structuredClone(initialState);
    });
    it('should return the current parameter state based on the selected measurement data type', () => {
      const measurementDataType = 'normal';
      state[measurementDataType].parameters = parameters;
      state[measurementDataType].loadingState = 'loaded';

      const result = selectCurrentParameterState.projector(state, measurementDataType);

      expect(result.parameters).toEqual(jasmine.arrayWithExactContents(parameters));
      expect(result.loadingState).toBe('loaded');
    });
  });

  describe('selectParameterGroupsSortedByLocalizedName', () => {
    it('should return the parameter groups sorted by their localized name', () => {
      const parameterGroups: ParameterGroup[] = [
        {name: {de: 'Z', en: 'A', fr: 'A', it: 'A'}, id: '1'},
        {name: {de: 'A', en: 'B', fr: 'B', it: 'B'}, id: '2'},
        {name: {de: 'B', en: 'Z', fr: 'Z', it: 'Z'}, id: '3'},
      ];
      const result = selectParameterGroupsSortedByLocalizedName.projector(parameterGroups, 'de');

      expect(result).toEqual(
        jasmine.arrayWithExactContents([
          {name: {de: 'A', en: 'B', fr: 'B', it: 'B'}, id: '2'},
          {name: {de: 'B', en: 'Z', fr: 'Z', it: 'Z'}, id: '3'},
          {name: {de: 'Z', en: 'A', fr: 'A', it: 'A'}, id: '1'},
        ]),
      );
    });
  });
});
