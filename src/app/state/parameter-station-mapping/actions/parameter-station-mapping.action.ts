import {createActionGroup, props} from '@ngrx/store';
import {ParameterStationMapping} from '../../../shared/models/parameter-station-mapping';
import {errorProps} from '../../utils/error-props.util';

export const parameterStationMappingActions = createActionGroup({
  source: 'ParameterStationMappings',
  events: {
    'Set loaded parameter station mappings': props<{parameterStationMappings: ParameterStationMapping[]}>(),
    'Load parameter station mappings for collections': props<{collections: string[]}>(),
    'Set parameter station mapping loading error': errorProps(),
  },
});
