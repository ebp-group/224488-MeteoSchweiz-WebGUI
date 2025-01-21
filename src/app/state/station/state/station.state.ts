import {Station, StationParameter, StationParameterMapping} from '../../../shared/types/station.types';

export interface StationState {
  stations: Station[];
  stationParameters: StationParameter[];
  stationParameterMappings: StationParameterMapping[];
}
