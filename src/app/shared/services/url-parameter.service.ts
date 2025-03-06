import {DOCUMENT} from '@angular/common';
import {inject, Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {map, Observable, take} from 'rxjs';
import {selectCurrentAppUrlParameter} from '../../state/app/selectors/app.selector';
import {collectionConfig} from '../configs/collections.config';
import {languageConfig} from '../configs/language.config';
import {AppUrlParameter} from '../models/app-url-parameter';
import {HostMessage} from '../models/host-message';
import {Language} from '../models/language';
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

  public setLanguage(language: Language): Observable<void> {
    return this.setUrlParameter(this.languageKey, language);
  }

  public setMeasurementDataType(measurementDataType: string): Observable<void> {
    return this.setUrlParameter(this.measurementDataTypeKey, measurementDataType);
  }

  public setParameterGroupId(parameterGroupId: string | null): Observable<void> {
    return this.setUrlParameter(this.parameterGroupIdKey, parameterGroupId);
  }

  public setStationId(stationId: string | null): Observable<void> {
    return this.setUrlParameter(this.stationIdKey, stationId);
  }

  private setUrlParameter(key: string, value: string | null): Observable<void> {
    return this.store.select(selectCurrentAppUrlParameter).pipe(
      take(1),
      map((appUrlParameter) => {
        const currentUrlParams = this.transformAppUrlParameterToUrlFragment(appUrlParameter);
        if (value === null) {
          currentUrlParams.delete(key);
        } else {
          currentUrlParams.set(key, value);
        }
        const message: HostMessage = {src: currentUrlParams.toString()};
        // the targetOrigin is set to '*' so that it works across domain boundaries. At least that is the description of the provider.
        this.document.defaultView?.parent.postMessage(message, '*');
      }),
    );
  }

  private transformAppUrlParameterToUrlFragment(appUrlParameter: AppUrlParameter): URLSearchParams {
    const urlParams = new URLSearchParams();
    urlParams.set(this.languageKey, appUrlParameter.language);
    urlParams.set(this.measurementDataTypeKey, appUrlParameter.measurementDataType);
    if (appUrlParameter.parameterGroupId) {
      urlParams.set(this.parameterGroupIdKey, appUrlParameter.parameterGroupId);
    }
    if (appUrlParameter.stationId) {
      urlParams.set(this.stationIdKey, appUrlParameter.stationId);
    }
    return urlParams;
  }
}
