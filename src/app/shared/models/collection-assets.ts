import {CollectionMetaAssetType} from './collection-meta-assets';

export interface CollectionAsset {
  metaFileType: CollectionMetaAssetType | undefined;
  filename: string;
  url: string;
  collection: string;
}
