import {HasLoadingState} from '../../../shared/models/has-loading-state.interface';
import type {Parameter} from '../../../shared/models/parameter';

export interface ParameterState extends HasLoadingState {
  parameters: Parameter[];
}
