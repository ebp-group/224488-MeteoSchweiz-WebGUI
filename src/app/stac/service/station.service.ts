import {inject, Injectable} from '@angular/core';
import {StacApiService} from './stac-api.service';
import type {Station} from '../../shared/models/station';
import type {CsvStation} from '../models/csv-station';

@Injectable({
  providedIn: 'root',
})
export class StationService {
  private readonly stacApiService = inject(StacApiService);

  public async loadStationsForCollections(collections: string[]): Promise<Station[]> {
    const stations = (await Promise.all(collections.map((collection) => this.getStationForCollection(collection)))).flat();
    return stations.reduce(
      (uniqueStations: Station[], station) =>
        !uniqueStations.some((uniqueStation) => uniqueStation.id === station.id) ? [...uniqueStations, station] : uniqueStations,
      [],
    );
  }

  private async getStationForCollection(collection: string): Promise<Station[]> {
    const csvStations: CsvStation[] = await this.stacApiService.getCollectionMetaCsvFile<CsvStation>(collection, 'stations');
    return csvStations.map(this.transformCsvStation);
  }

  private transformCsvStation(csvStation: CsvStation): Station {
    return {
      id: csvStation.stationAbbr,
      name: csvStation.stationName,
      displayName: `${csvStation.stationName} (${csvStation.stationAbbr})`,
      coordinates: {
        longitude: Number(csvStation.stationCoordinatesWgs84Lon),
        latitude: Number(csvStation.stationCoordinatesWgs84Lat),
      },
    };
  }
}
