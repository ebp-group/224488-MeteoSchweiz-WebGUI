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
    return stations.reduce((uniqueStations: Station[], station) => {
      const existingStation = uniqueStations.find((uniqueStation) => uniqueStation.id === station.id);
      if (existingStation != null) {
        existingStation.collections = [...new Set([...existingStation.collections, ...station.collections])];
        return uniqueStations;
      } else {
        return [...uniqueStations, station];
      }
    }, []);
  }

  private async getStationForCollection(collection: string): Promise<Station[]> {
    const csvStations: CsvStation[] = await this.stacApiService.getCollectionMetaCsvFile<CsvStation>(collection, 'stations');
    return csvStations.map((csvStation) => this.transformCsvStation(csvStation, collection));
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
      collections: [collection],
    };
  }
}
