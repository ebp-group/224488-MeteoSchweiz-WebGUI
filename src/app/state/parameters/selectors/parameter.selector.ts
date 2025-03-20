import {createSelector} from '@ngrx/store';
import {ParameterService} from '../../../stac/service/parameter.service';
import {appFeature} from '../../app/reducers/app.reducer';
import {formFeature} from '../../form/reducers/form.reducer';
import {parameterFeature} from '../reducers/parameter.reducer';
import type {LocalizedParameterGroup, ParameterGroup} from '../../../shared/models/parameter';
import type {ParameterStateEntry} from '../states/parameter.state';

export const selectCurrentParameterState = createSelector(
  parameterFeature.selectParametersState,
  formFeature.selectSelectedMeasurementDataType,
  (parameterState, measurementDataType): ParameterStateEntry => parameterState[measurementDataType],
);

export const selectParameterGroups = createSelector(selectCurrentParameterState, (parameterState): ParameterGroup[] =>
  parameterState.parameters
    .map((parameter) => ({name: parameter.group, id: ParameterService.extractGroupIdFromGroupName(parameter.group)}))
    .reduce(
      (uniqueGroups: ParameterGroup[], group) =>
        !uniqueGroups.some((uniqueGroup) => group.id === uniqueGroup.id) ? [...uniqueGroups, group] : uniqueGroups,
      [],
    ),
);

export const selectLocalizedAndSortedParameterGroups = createSelector(
  selectParameterGroups,
  appFeature.selectLanguage,
  (parameterGroups, language): LocalizedParameterGroup[] =>
    parameterGroups
      .map((parameterGroup): LocalizedParameterGroup => ({...parameterGroup, displayName: parameterGroup.name[language]}))
      .sort((a, b) => a.displayName.localeCompare(b.displayName)),
);
