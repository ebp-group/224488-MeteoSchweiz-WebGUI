import {createSelector} from '@ngrx/store';
import {ParameterGroupStationMapping} from '../../../shared/models/parameter-group-station-mapping';
import {ParameterService} from '../../../stac/service/parameter.service';
import {selectCurrentParameterState} from '../../parameters/selectors/parameter.selector';
import {parameterStationMappingFeature} from '../reducers/parameter-station-mapping.reducer';

export const selectParameterGroupStationMappings = createSelector(
  parameterStationMappingFeature.selectParameterStationMappings,
  selectCurrentParameterState,
  (parameterStationMappings, parameterState): ParameterGroupStationMapping[] =>
    parameterStationMappings.reduce((uniqueGroupMappings: ParameterGroupStationMapping[], mapping) => {
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
