import {DOCUMENT} from '@angular/common';
import {inject, Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {collectionConfig} from '../configs/collections.config';
import {languageConfig} from '../configs/language.config';
import {AppUrlParameter} from '../models/app-url-parameter';
import {isLanguage} from '../type-guards/language-guard';
import {isMeasurementDataType} from '../type-guards/measurement-data-type-guard';

@Injectable({
  providedIn: 'root',
})
export class UrlParameterService {
  private readonly document = inject(DOCUMENT);
  private readonly store = inject(Store);

  private readonly languageKey = 'lang' as const;
  private readonly measurementDataTypeKey = 'mdt' as const;
  private readonly parameterGroupIdKey = 'pgid' as const;
  private readonly stationIdKey = 'sid' as const;

  public transformUrlFragmentToAppUrlParameter(fragment: string | undefined): AppUrlParameter {
    const urlParams = new URLSearchParams(fragment);
    const languageString = urlParams.get(this.languageKey);
    const measurementDataTypeString = urlParams.get(this.measurementDataTypeKey);
    return {
      language: languageString && isLanguage(languageString) ? languageString : languageConfig.defaultLanguage,
      measurementDataType:
        measurementDataTypeString && isMeasurementDataType(measurementDataTypeString)
          ? measurementDataTypeString
          : collectionConfig.defaultMeasurementDataType,
      parameterGroupId: urlParams.get(this.parameterGroupIdKey),
      stationId: urlParams.get(this.stationIdKey),
    };
  }
}
