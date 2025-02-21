import {inject, Injectable} from '@angular/core';
import {TranslatableString} from '../../shared/models/translatable-string';
import {StacApiService} from './stac-api.service';
import type {Parameter} from '../../shared/models/parameter';
import type {CsvParameter} from '../models/csv-parameter';

@Injectable({
  providedIn: 'root',
})
export class ParameterService {
  private readonly stacApiService = inject(StacApiService);

  public async loadParameterForCollections(collections: string[]): Promise<Parameter[]> {
    const parameters = await Promise.all(collections.map((collection) => this.getParametersForCollection(collection)));
    return parameters.flat();
  }

  public static extractIdFromShortname(shortname: string): string {
    return shortname.slice(0, -2);
  }

  public static extractGroupIdFromGroupName(group: TranslatableString): string {
    return group.en;
  }

  private async getParametersForCollection(collection: string): Promise<Parameter[]> {
    const csvParameters: CsvParameter[] = await this.stacApiService.getCollectionMetaCsvFile<CsvParameter>(collection, 'parameters');
    return csvParameters.map(this.transformCsvParameter);
  }

  private transformCsvParameter(csvParameter: CsvParameter): Parameter {
    return {
      id: ParameterService.extractIdFromShortname(csvParameter.parameterShortname),
      description: {
        de: csvParameter.parameterDescriptionDe,
        en: csvParameter.parameterDescriptionEn,
        fr: csvParameter.parameterDescriptionFr,
        it: csvParameter.parameterDescriptionIt,
      },
      group: {
        de: csvParameter.parameterGroupDe,
        en: csvParameter.parameterGroupEn,
        fr: csvParameter.parameterGroupFr,
        it: csvParameter.parameterGroupIt,
      },
    };
  }
}
