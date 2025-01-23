import {AssetInterval, Station, StationAsset, StationParameterGroup} from '../../../shared/types/station.types';

export interface FormState {
  selectedParameterGroup: StationParameterGroup | null;
  selectedStation: Station | null;
  assetsFromSelectedStation: StationAsset[];
  intervalSelection: AssetInterval | null;
}
