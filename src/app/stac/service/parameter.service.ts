import {inject, Injectable} from '@angular/core';
import {CollectionAsset} from '../../shared/models/collection-assets';
import {TranslatableString} from '../../shared/models/translatable-string';
import {StacApiService} from './stac-api.service';
import type {Parameter} from '../../shared/models/parameter';
import type {CsvParameter} from '../models/csv-parameter';

@Injectable({
  providedIn: 'root',
})
export class ParameterService {
  private readonly stacApiService = inject(StacApiService);

  public async loadParameterForCollections(collectionAssets: CollectionAsset[]): Promise<Parameter[]> {
    const relevantAssets = collectionAssets.filter((asset) => asset.metaFileType === 'parameter');
    const parameters = (await Promise.all(relevantAssets.map((assets) => this.getParametersForCollection(assets)))).flat();
    return parameters.reduce(
      (uniqueParameters: Parameter[], parameter) =>
        !uniqueParameters.some((uniqueParameter) => uniqueParameter.id === parameter.id)
          ? [...uniqueParameters, parameter]
          : uniqueParameters,
      [],
    );
  }

  public static extractIdFromShortname(shortname: string): string {
    return shortname.slice(0, -2);
  }

  public static extractGroupIdFromGroupName(group: TranslatableString): string {
    return group.en;
  }

  private async getParametersForCollection(collectionAsset: CollectionAsset): Promise<Parameter[]> {
    const csvParameters: CsvParameter[] = await this.stacApiService.fetchAndParseCsvFile<CsvParameter>(collectionAsset.url);
    return csvParameters.map((csvParameter) => this.transformCsvParameter(csvParameter));
  }

  private transformCsvParameter(csvParameter: CsvParameter): Parameter {
    return {
      id: ParameterService.extractIdFromShortname(csvParameter.parameterShortname),
      group: {
        de: csvParameter.parameterGroupDe,
        en: csvParameter.parameterGroupEn,
        fr: csvParameter.parameterGroupFr,
        it: csvParameter.parameterGroupIt,
      },
    };
  }
}
