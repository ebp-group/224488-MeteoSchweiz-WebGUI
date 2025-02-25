import {LoadableState} from '../../../shared/models/loadable-state';
import type {Parameter} from '../../../shared/models/parameter';

export interface ParameterState extends LoadableState {
  parameters: Parameter[];
}
