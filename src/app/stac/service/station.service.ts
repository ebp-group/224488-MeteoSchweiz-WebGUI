import {inject, Injectable} from '@angular/core';
import {Station} from '../../shared/models/station';
import {StacApiService} from './stac-api.service';

export interface CsvStation {
  stationAbbr: string;
  stationName: string;
  stationCanton: string;
  stationWigosId: string;
  stationTypeDe: string;
  stationTypeFr: string;
  stationTypeIt: string;
  stationTypeEn: string;
  stationDataowner: string;
  stationDataSince: string;
  stationHeightMasl: string;
  stationHeightBarometerMasl: string;
  stationCoordinatesLv95East: `${number}`;
  stationCoordinatesLv95North: `${number}`;
  stationCoordinatesWgs84Lat: `${number}`;
  stationCoordinatesWgs84Lon: `${number}`;
  stationExpositionDe: string;
  stationExpositionFr: string;
  stationExpositionIt: string;
  stationExpositionEn: string;
  stationUrlDe: string;
  stationUrlFr: string;
  stationUrlIt: string;
  stationUrlEn: string;
}

@Injectable({
  providedIn: 'root',
})
export class StationService {
  private readonly stacApiService = inject(StacApiService);

  public async loadStationsForCollections(collections: string[]): Promise<Station[]> {
    const stations = await Promise.all(collections.map((collection) => this.getStationForCollection(collection)));
    let result: Station[] = [];
    stations.forEach(
      (stationList) => (result = result.concat(stationList.filter((station) => !result.some((value) => value.id === station.id)))),
    );
    return result;
  }

  public async getStationForCollection(collection: string): Promise<Station[]> {
    const csvStations: CsvStation[] = await this.stacApiService.getCollectionMetaCsvFile<CsvStation>(collection, 'stations');
    return csvStations.map(this.transformCsvStation);
  }

  public transformCsvStation(csvStation: CsvStation) {
    return {
      id: csvStation.stationAbbr,
      name: csvStation.stationName,
    };
  }
}
