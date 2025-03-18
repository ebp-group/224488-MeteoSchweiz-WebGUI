import {inject, Injectable} from '@angular/core';
import {CollectionAsset} from '../../shared/models/collection-assets';
import {StacApiService} from './stac-api.service';
import type {Station} from '../../shared/models/station';
import type {CsvStation} from '../models/csv-station';

@Injectable({
  providedIn: 'root',
})
export class StationService {
  private readonly stacApiService = inject(StacApiService);

  public async loadStationsForCollections(collectionAssets: CollectionAsset[]): Promise<Station[]> {
    const relevantAssets = collectionAssets.filter((asset) => asset.metaFileType === 'station');
    const stations = await Promise.all(relevantAssets.map((asset) => this.getStationForCollection(asset)));
    return stations.flat();
  }

  private async getStationForCollection(collectionAsset: CollectionAsset): Promise<Station[]> {
    const csvStations: CsvStation[] = await this.stacApiService.fetchAndParseCsvFile<CsvStation>(collectionAsset.url);
    return csvStations.map((csvStation) => this.transformCsvStation(csvStation, collectionAsset.collection));
  }

  private transformCsvStation(csvStation: CsvStation, collection: string): Station {
    return {
      id: csvStation.stationAbbr,
      name: csvStation.stationName,
      displayName: `${csvStation.stationName} (${csvStation.stationAbbr})`,
      coordinates: {
        longitude: Number(csvStation.stationCoordinatesWgs84Lon),
        latitude: Number(csvStation.stationCoordinatesWgs84Lat),
      },
      collection: collection,
      type: {
        de: csvStation.stationTypeDe,
        en: csvStation.stationTypeEn,
        fr: csvStation.stationTypeFr,
        it: csvStation.stationTypeIt,
      },
    };
  }
}
