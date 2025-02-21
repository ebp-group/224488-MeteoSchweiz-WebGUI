import {inject, Injectable} from '@angular/core';
import {ParameterStationMapping} from '../../shared/models/parameter-station-mapping';
import {CsvDataInventory} from '../models/csv-data-inventory';
import {ParameterService} from './parameter.service';
import {StacApiService} from './stac-api.service';

@Injectable({
  providedIn: 'root',
})
export class DataInventoryService {
  private readonly stacApiService = inject(StacApiService);

  public async loadParameterStationMappingsForCollections(collections: string[]): Promise<ParameterStationMapping[]> {
    const parameterStationMappings = await Promise.all(
      collections.map((collection) => this.getParameterStationMappingsForCollection(collection)),
    );
    return parameterStationMappings.flat();
  }

  private async getParameterStationMappingsForCollection(collection: string): Promise<ParameterStationMapping[]> {
    const csvDataInventory: CsvDataInventory[] = await this.stacApiService.getCollectionMetaCsvFile<CsvDataInventory>(
      collection,
      'datainventory',
    );
    return csvDataInventory.map(this.transformCsvDataInventory);
  }

  private transformCsvDataInventory(csvDataInventory: CsvDataInventory): ParameterStationMapping {
    return {
      parameterId: ParameterService.extractIdFromShortname(csvDataInventory.paramShortNameTx),
      stationId: csvDataInventory.stationNatAbbrTx,
    };
  }
}
