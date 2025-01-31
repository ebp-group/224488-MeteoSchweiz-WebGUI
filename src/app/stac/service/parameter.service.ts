import {inject, Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {parameterActions} from '../../state/parameters/actions/parameter.action';
import {StacApiService} from './stac-api.service';
import type {Parameter} from '../../shared/models/parameter';

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
  private readonly store = inject(Store);

  public async loadParameterForCollections(collections: string[]): Promise<void> {
    const parameters = await Promise.all(collections.map((collection) => this.getParametersForCollection(collection)));
    this.store.dispatch(parameterActions.setLoadedParameters({parameters: parameters.flat()}));
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
}
