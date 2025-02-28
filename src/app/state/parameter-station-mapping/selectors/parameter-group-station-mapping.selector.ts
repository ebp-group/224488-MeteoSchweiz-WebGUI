import {createSelector} from '@ngrx/store';
import {ParameterGroupStationMapping} from '../../../shared/models/parameter-group-station-mapping';
import {ParameterService} from '../../../stac/service/parameter.service';
import {formFeature} from '../../form/reducers/form.reducer';
import {selectCurrentParameterState} from '../../parameters/selectors/parameter.selector';
import {parameterStationMappingFeature} from '../reducers/parameter-station-mapping.reducer';
import {ParameterStationMappingStateEntry} from '../states/parameter-station-mapping.state';

export const selectCurrentParameterStationMappingState = createSelector(
  parameterStationMappingFeature.selectParameterStationMappingsState,
  formFeature.selectSelectedMeasurementDataType,
  (parameterStationMappingState, measurementDataType): ParameterStationMappingStateEntry =>
    parameterStationMappingState[measurementDataType],
);

export const selectParameterGroupStationMappings = createSelector(
  selectCurrentParameterStationMappingState,
  selectCurrentParameterState,
  (parameterStationMappingState, parameterState): ParameterGroupStationMapping[] =>
    parameterStationMappingState.parameterStationMappings.reduce((uniqueGroupMappings: ParameterGroupStationMapping[], mapping) => {
      const parameterGroup = parameterState.parameters.find((parameter) => parameter.id === mapping.parameterId)?.group;
      if (parameterGroup) {
        const parameterGroupId = ParameterService.extractGroupIdFromGroupName(parameterGroup);
        const mappingExists = uniqueGroupMappings.some(
          (uniqueGroupMapping) =>
            uniqueGroupMapping.parameterGroupId === parameterGroupId && uniqueGroupMapping.stationId === mapping.stationId,
        );
        return mappingExists ? uniqueGroupMappings : [...uniqueGroupMappings, {parameterGroupId, stationId: mapping.stationId}];
      }
      return uniqueGroupMappings;
    }, []),
);
