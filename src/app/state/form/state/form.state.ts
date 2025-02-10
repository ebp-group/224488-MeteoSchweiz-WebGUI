import {DataInterval} from '../../../shared/models/interval';

export interface FormState {
  selectedParameterGroupId: string | null;
  selectedDataInterval: DataInterval | null;
}
