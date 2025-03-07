import {ParameterGroup} from './parameter';
import {Station} from './station';

export interface StationWithParameterGroups {
  station: Station;
  parameterGroups: ParameterGroup[];
}
