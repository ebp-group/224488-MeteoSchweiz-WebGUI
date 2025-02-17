import {inject, Injectable} from '@angular/core';
import {StacApiService} from './stac-api.service';
import type {Parameter, ParameterGroup} from '../../shared/models/parameter';

export interface CsvParameter {
  parameterShortname: string;
  parameterDescriptionDe: string;
  parameterDescriptionFr: string;
  parameterDescriptionIt: string;
  parameterDescriptionEn: string;
  parameterGroupDe: string;
  parameterGroupFr: string;
  parameterGroupIt: string;
  parameterGroupEn: string;
  parameterGranularity: 'T' | 'H' | 'D' | 'M' | 'Y';
  parameterDecimals: `${number}`;
  parameterDatatype: 'Integer' | 'Float';
  parameterUnit: string;
}

@Injectable({
  providedIn: 'root',
})
export class ParameterService {
  private readonly stacApiService = inject(StacApiService);

  public async loadParameterForCollections(collections: string[]): Promise<Parameter[]> {
    const parameters = await Promise.all(collections.map((collection) => this.getParametersForCollection(collection)));
    return parameters.flat();
  }

  public async getParametersForCollection(collection: string): Promise<Parameter[]> {
    const csvParameters: CsvParameter[] = await this.stacApiService.getCollectionMetaCsvFile<CsvParameter>(collection, 'parameters');
    return csvParameters.map(this.transformCsvParameter);
  }

  public transformCsvParameter(csvParameter: CsvParameter): Parameter {
    return {
      id: csvParameter.parameterShortname.slice(0, -2),
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

  public getParameterGroups(parameters: Parameter[]): ParameterGroup[] {
    const groups = new Map<string, ParameterGroup>();
    for (const group of parameters.map((parameter) => parameter.group)) {
      if (!groups.has(group.en)) {
        groups.set(group.en, {name: group, id: group.en});
      }
    }
    return Array.from(groups.values());
  }
}
