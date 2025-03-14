import {LoadableState} from '../../../shared/models/loadable-state';
import type {StationAsset} from '../../../shared/models/station-assets';

export interface AssetState extends LoadableState {
  assets: StationAsset[] | undefined;
}
