export interface CollectionAsset {
  metaFileType: 'station' | 'parameter' | 'data-inventory' | undefined;
  filename: string;
  url: string;
  collection: string;
}
