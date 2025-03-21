import {DOCUMENT} from '@angular/common';
import {inject, Injectable} from '@angular/core';
import {collectionConfig} from '../configs/collections.config';
import {languageConfig} from '../configs/language.config';
import {AppUrlParameter} from '../models/app-url-parameter';
import {HostMessage} from '../models/host-message';
import {isDataInterval} from '../type-guards/data-interval-guard';
import {isLanguage} from '../type-guards/language-guard';
import {isMeasurementDataType} from '../type-guards/measurement-data-type-guard';
import {isTimeRange} from '../type-guards/time-range-guard';

@Injectable({
  providedIn: 'root',
})
export class UrlParameterService {
  private readonly document = inject(DOCUMENT);

  private readonly languageKey = 'lang' as const;
  private readonly measurementDataTypeKey = 'mdt' as const;
  private readonly parameterGroupIdKey = 'pgid' as const;
  private readonly stationIdKey = 'sid' as const;
  private readonly collectionKey = 'col' as const;
  private readonly dataIntervalKey = 'di' as const;
  private readonly timeRangeKey = 'tr' as const;

  public transformUrlFragmentToAppUrlParameter(fragment: string | undefined): AppUrlParameter {
    const urlParams = new URLSearchParams(fragment);
    const languageString = urlParams.get(this.languageKey);
    const measurementDataTypeString = urlParams.get(this.measurementDataTypeKey);
    const dataIntervalString = urlParams.get(this.dataIntervalKey);
    const timeRangeString = urlParams.get(this.timeRangeKey);
    return {
      language: languageString && isLanguage(languageString) ? languageString : languageConfig.defaultLanguage,
      measurementDataType:
        measurementDataTypeString && isMeasurementDataType(measurementDataTypeString)
          ? measurementDataTypeString
          : collectionConfig.defaultMeasurementDataType,
      parameterGroupId: urlParams.get(this.parameterGroupIdKey),
      stationId: urlParams.get(this.stationIdKey),
      collection: urlParams.get(this.collectionKey),
      dataInterval: dataIntervalString && isDataInterval(dataIntervalString) ? dataIntervalString : null,
      timeRange: timeRangeString && isTimeRange(timeRangeString) ? timeRangeString : null,
    };
  }

  public setUrlFragment(appUrlParameter: AppUrlParameter): void {
    const urlFragment = this.transformAppUrlParameterToUrlFragment(appUrlParameter);
    const message: HostMessage = {src: urlFragment};
    const window = this.document.defaultView;
    if (!window) {
      // this should never happen™ at this point
      throw new Error('Window is not available');
    }

    if (window !== window.parent) {
      // this sends a message to the parent window outside the iframe context (to set the fragment to the current URL)
      // Remark: the targetOrigin is set to '*' so that it works across multiple domain boundaries
      //         there shouldn't be a security issue with that as all data is already public and there is no authentication involved
      window.parent.postMessage(message, '*');
    } else {
      // this sets the fragment directly to the current URL
      window.location.hash = urlFragment;
    }
  }

  private transformAppUrlParameterToUrlFragment(appUrlParameter: AppUrlParameter): string {
    const urlParams = new URLSearchParams();
    urlParams.set(this.languageKey, appUrlParameter.language);
    urlParams.set(this.measurementDataTypeKey, appUrlParameter.measurementDataType);
    if (appUrlParameter.parameterGroupId) {
      urlParams.set(this.parameterGroupIdKey, appUrlParameter.parameterGroupId);
    }
    if (appUrlParameter.stationId) {
      urlParams.set(this.stationIdKey, appUrlParameter.stationId);
    }
    if (appUrlParameter.collection) {
      urlParams.set(this.collectionKey, appUrlParameter.collection);
    }
    if (appUrlParameter.dataInterval) {
      urlParams.set(this.dataIntervalKey, appUrlParameter.dataInterval);
    }
    if (appUrlParameter.timeRange) {
      urlParams.set(this.timeRangeKey, appUrlParameter.timeRange);
    }
    return urlParams.toString();
  }
}
