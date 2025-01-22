import {Station, StationParameterGroup} from '../../../shared/types/station.types';

export interface FormState {
  selectedParameterGroup: StationParameterGroup | null;
  selectedStation: Station | null;
}
