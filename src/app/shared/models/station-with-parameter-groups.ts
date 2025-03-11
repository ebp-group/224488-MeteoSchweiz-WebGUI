import type {ParameterGroup} from './parameter';
import type {Station} from './station';

export interface StationWithParameterGroups extends Station {
  parameterGroups: ParameterGroup[];
}
