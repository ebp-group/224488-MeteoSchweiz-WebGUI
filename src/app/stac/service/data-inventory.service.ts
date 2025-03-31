import {inject, Injectable} from '@angular/core';
import {CollectionAsset} from '../../shared/models/collection-assets';
import {ParameterStationMapping} from '../../shared/models/parameter-station-mapping';
import {CsvDataInventory, OldCsvDataInventory} from '../models/csv-data-inventory';
import {ParameterService} from './parameter.service';
import {StacApiService} from './stac-api.service';

@Injectable({
  providedIn: 'root',
})
export class DataInventoryService {
  private readonly stacApiService = inject(StacApiService);

  public async loadParameterStationMappingsForCollections(collectionAssets: CollectionAsset[]): Promise<ParameterStationMapping[]> {
    const relevantAssets = collectionAssets.filter((asset) => asset.metaFileType === 'dataInventory');
    const parameterStationMappings = await Promise.all(relevantAssets.map((asset) => this.getParameterStationMappingsForCollection(asset)));
    return parameterStationMappings.flat();
  }

  private async getParameterStationMappingsForCollection(collectionAsset: CollectionAsset): Promise<ParameterStationMapping[]> {
    const csvDataInventory = await this.stacApiService.fetchAndParseCsvFile<CsvDataInventory>(collectionAsset.url);
    return csvDataInventory.map((dataInventory) => {
      try {
        return this.transformCsvDataInventory(dataInventory, collectionAsset.collection);
      } catch {
        return this.transformOldCsvDataInventory(dataInventory as unknown as OldCsvDataInventory, collectionAsset.collection);
      }
    });
  }

  private transformCsvDataInventory(csvDataInventory: CsvDataInventory, collection: string): ParameterStationMapping {
    return {
      parameterId: ParameterService.extractIdFromShortname(csvDataInventory.parameterShortname),
      stationId: csvDataInventory.stationAbbr,
      collection,
    };
  }

  private transformOldCsvDataInventory(csvDataInventory: OldCsvDataInventory, collection: string): ParameterStationMapping {
    return {
      parameterId: ParameterService.extractIdFromShortname(csvDataInventory.paramShortNameTx),
      stationId: csvDataInventory.stationNatAbbrTx,
      collection,
    };
  }
}
