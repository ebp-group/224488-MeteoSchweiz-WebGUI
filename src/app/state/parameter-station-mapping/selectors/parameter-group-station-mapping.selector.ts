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
  ({parameterStationMappings}, {parameters}): ParameterGroupStationMapping[] => {
    const groupToStationMap = new Map<string, ParameterGroupStationMapping>();
    const parameterIdToGroupIdMap = new Map(
      parameters.map((parameter) => [parameter.id, ParameterService.extractGroupIdFromGroupName(parameter.group)]),
    );
    parameterStationMappings.forEach((mapping) => {
      const parameterGroupId = parameterIdToGroupIdMap.get(mapping.parameterId);
      if (parameterGroupId) {
        const groupToStationMapId = `${parameterGroupId}-${mapping.stationId}`;
        const existingGroupToStationMap = groupToStationMap.get(groupToStationMapId);
        if (!existingGroupToStationMap) {
          groupToStationMap.set(groupToStationMapId, {parameterGroupId, stationId: mapping.stationId, collections: [mapping.collection]});
        } else {
          existingGroupToStationMap.collections = [...new Set([...existingGroupToStationMap.collections, mapping.collection])];
        }
      }
    });
    return Array.from(groupToStationMap.values());
  },
);
