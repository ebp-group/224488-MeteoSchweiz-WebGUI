import {LoadableState} from '../../../shared/models/loadable-state';
import {MeasurementDataType} from '../../../shared/models/measurement-data-type';
import type {Parameter} from '../../../shared/models/parameter';

export interface ParameterStateEntry extends LoadableState {
  parameters: Parameter[];
}

export type ParameterState = Record<MeasurementDataType, ParameterStateEntry>;
