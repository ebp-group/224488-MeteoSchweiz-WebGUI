import {createSelector} from '@ngrx/store';
import {parameterFeature} from '../reducers/parameter.reducer';
import type {ParameterGroup} from '../../../shared/models/parameter';

export const selectParameterGroups = createSelector(parameterFeature.selectParameters, (parameters): ParameterGroup[] =>
  parameters
    .map((parameter) => ({name: parameter.group, id: parameter.group.en}))
    .reduce(
      (uniqueGroups: ParameterGroup[], group) =>
        !uniqueGroups.some((uniqueGroup) => group.id === uniqueGroup.id) ? [...uniqueGroups, group] : uniqueGroups,
      [],
    ),
);
