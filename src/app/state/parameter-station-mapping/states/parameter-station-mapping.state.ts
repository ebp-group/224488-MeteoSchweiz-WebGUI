import {HasLoadingState} from '../../../shared/models/has-loading-state.interface';
import {ParameterStationMapping} from '../../../shared/models/parameter-station-mapping';

export interface ParameterStationMappingState extends HasLoadingState {
  parameterStationMappings: ParameterStationMapping[];
}
