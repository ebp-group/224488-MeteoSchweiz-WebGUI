import {Injectable} from '@angular/core';
import papa from 'papaparse';
import {defaultStacClientConfig} from '../../shared/configs/stac.config';
import {StacApiClient} from '../generated/stac-api.generated';
import {StacStationAsset} from '../models/stac-station-asset';

@Injectable({
  providedIn: 'root',
})
export class StacApiService {
  private readonly stacApiClient = new StacApiClient({baseUrl: defaultStacClientConfig.baseUrl});

  public async getCollectionMetaCsvFile<T>(collectionName: string, metaFile: 'stations' | 'parameters' | 'datainventory'): Promise<T[]> {
    const collectionResponse = await this.stacApiClient.collections.describeCollection(collectionName, {format: 'json'});
    if (!collectionResponse.ok) {
      // TODO: create specific error classes
      throw new Error(`Failed to get collection ${collectionName}`);
    }

    const collection = collectionResponse.data;
    if (collection == null) {
      throw new Error(`Collection was null. Collection: ${collectionName}, metaFile: ${metaFile}`);
    }
    if (collection.assets == null) {
      throw new Error(`Collection did not contain any assets. Collection: ${collectionName}, metaFile: ${metaFile}`);
    }

    const metaDataFileUrl = Object.entries(collection.assets).find(([key]) => key.includes(metaFile))?.[1]?.href;
    if (!metaDataFileUrl) {
      throw new Error(`Could not find URL for meta data CSV. Collection: ${collectionName}, metaFile: ${metaFile}`);
    }

    const parsedResult = new Promise<T[]>((resolve) => {
      papa.parse<T>(metaDataFileUrl, {
        download: true,
        delimiter: defaultStacClientConfig.csvDelimiter,
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => {
          if (header.includes('_')) {
            // Transform header is called multiple times for the same header. We only have to perform the transformation once
            header = header.toLowerCase().replace(/(_\w)/g, (group) => group[1].toUpperCase());
          }
          return header;
        },
        complete: (result) => {
          resolve(result.data);
        },
      });
    });
    return parsedResult;
  }

  public async getStationAssets(collectionId: string, stationId: string): Promise<StacStationAsset[]> {
    const response = await this.stacApiClient.collections.getFeature(collectionId, stationId.toLocaleLowerCase(), {format: 'json'});
    if (!response.ok) {
      throw new Error(`Failed to get station '${stationId}' for collection '${collectionId}'`);
    }
    const feature = response.data;
    if (feature == null) {
      throw new Error(`Station data for station '${stationId}' in collection '${collectionId}' was null`);
    }
    const assets = feature.assets;
    return Object.entries(assets)
      .filter(([, asset]) => asset.type === 'text/csv')
      .map(([filename, asset]) => ({filename, url: asset.href}));
  }
}
