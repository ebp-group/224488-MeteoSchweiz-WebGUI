import {Injectable} from '@angular/core';
import papa from 'papaparse';
import {stacClientConfig} from '../../shared/configs/stac.config';
import {StacCsvError, StacLoadError} from '../../shared/errors/stac.error';
import {StacApiClient} from '../generated/stac-api.generated';
import {StacAsset} from '../models/stac-asset';

@Injectable({
  providedIn: 'root',
})
export class StacApiService {
  private readonly stacApiClient = new StacApiClient({baseUrl: stacClientConfig.baseUrl});

  private readonly decoder = new TextDecoder(stacClientConfig.encoding);

  public async fetchAndParseCsvFile<T>(url: string): Promise<T[]> {
    const fileResponse = await fetch(url);
    if (!fileResponse.ok) {
      throw new StacCsvError(url);
    }

    const fileContent = await fileResponse.arrayBuffer();
    if (!fileContent) {
      throw new StacCsvError(url);
    }

    const file = this.decoder.decode(fileContent);

    return new Promise<T[]>((resolve) => {
      papa.parse<T>(file, {
        download: false,
        delimiter: stacClientConfig.csvDelimiter,
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
  }

  public async getAssets(collectionId: string, stationId?: string): Promise<StacAsset[]> {
    const response =
      stationId != null
        ? await this.stacApiClient.collections.getFeature(collectionId, stationId.toLocaleLowerCase(), {format: 'json'})
        : await this.stacApiClient.collections.describeCollection(collectionId, {format: 'json'});

    if (!response.ok) {
      throw new StacLoadError(collectionId, stationId);
    }

    const feature = response.data;
    if (feature == null) {
      throw new StacLoadError(collectionId, stationId);
    }

    const assets = feature.assets;
    if (assets == null) {
      throw new StacLoadError(collectionId, stationId);
    }

    return Object.entries(assets)
      .filter(([, asset]) => asset.type === 'text/csv')
      .map(([filename, asset]) => ({filename, url: asset.href}));
  }
}
