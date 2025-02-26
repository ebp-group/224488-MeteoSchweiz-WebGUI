import {LoadableState} from '../../../shared/models/loadable-state';
import {MeasurementDataType} from '../../../shared/models/measurement-data-type';
import {ParameterStationMapping} from '../../../shared/models/parameter-station-mapping';

export interface ParameterStationMappingStateEntry extends LoadableState {
  parameterStationMappings: ParameterStationMapping[];
}

export type ParameterStationMappingState = Record<MeasurementDataType, ParameterStationMappingStateEntry>;
