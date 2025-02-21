import {createSelector} from '@ngrx/store';
import {ParameterGroupStationMapping} from '../../../shared/models/parameter-group-station-mapping';
import {ParameterService} from '../../../stac/service/parameter.service';
import {parameterFeature} from '../../parameters/reducers/parameter.reducer';
import {parameterStationMappingFeature} from '../reducers/parameter-station-mapping.reducer';

export const selectParameterGroupStationMappings = createSelector(
  parameterStationMappingFeature.selectParameterStationMappings,
  parameterFeature.selectParameters,
  (parameterStationMappings, parameters): ParameterGroupStationMapping[] =>
    parameterStationMappings.reduce((uniqueGroupMappings: ParameterGroupStationMapping[], mapping) => {
      const parameterGroup = parameters.find((parameter) => parameter.id === mapping.parameterId)?.group;
      if (parameterGroup) {
        const parameterGroupId = ParameterService.extractGroupIdFromGroupName(parameterGroup);
        const existMapping = uniqueGroupMappings.some(
          (uniqueGroupMapping) =>
            uniqueGroupMapping.parameterGroupId === parameterGroupId && uniqueGroupMapping.stationId === mapping.stationId,
        );
        return existMapping ? uniqueGroupMappings : [...uniqueGroupMappings, {parameterGroupId, stationId: mapping.stationId}];
      }
      return uniqueGroupMappings;
    }, []),
);
