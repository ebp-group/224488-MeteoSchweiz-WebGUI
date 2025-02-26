import {LoadableState} from '../../../shared/models/loadable-state';
import {MeasurementDataType} from '../../../shared/models/measurement-data-type';
import {Station} from '../../../shared/models/station';

export interface StationStateEntry extends LoadableState {
  stations: Station[];
}

export type StationState = Record<MeasurementDataType, StationStateEntry>;
