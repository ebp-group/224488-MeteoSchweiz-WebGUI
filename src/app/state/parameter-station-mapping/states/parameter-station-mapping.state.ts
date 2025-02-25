import {LoadableState} from '../../../shared/models/loadable-state';
import {ParameterStationMapping} from '../../../shared/models/parameter-station-mapping';

export interface ParameterStationMappingState extends LoadableState {
  parameterStationMappings: ParameterStationMapping[];
}
