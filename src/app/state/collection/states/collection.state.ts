import type {CollectionAsset} from '../../../shared/models/collection-assets';
import type {LoadableState} from '../../../shared/models/loadable-state';
import type {MeasurementDataType} from '../../../shared/models/measurement-data-type';

export interface CollectionStateEntry extends LoadableState {
  collectionAssets: CollectionAsset[];
}

export type CollectionState = Record<MeasurementDataType, CollectionStateEntry>;
