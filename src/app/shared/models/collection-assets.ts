import {CollectionMetaAssetType} from './collection-meta-asset-type';

export interface CollectionAsset {
  metaFileType: CollectionMetaAssetType | undefined;
  filename: string;
  url: string;
  collection: string;
}
