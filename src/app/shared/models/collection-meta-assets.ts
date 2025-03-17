import type {CollectionAsset} from './collection-assets';

export type CollectionMetaAssetType = 'station' | 'parameter' | 'dataInventory';

export type CollectionMetaAssets = Record<CollectionMetaAssetType, CollectionAsset>;
