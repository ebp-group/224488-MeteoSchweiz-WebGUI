import {DOCUMENT, inject, Injectable} from '@angular/core';
import {collectionConfig} from '../configs/collections.config';
import {languageConfig} from '../configs/language.config';
import {AppUrlParameter} from '../models/app-url-parameter';
import {DateRange} from '../models/date-range';
import {HostMessage} from '../models/host-message';
import {isDataInterval} from '../type-guards/data-interval-guard';
import {isLanguage} from '../type-guards/language-guard';
import {isMeasurementDataType} from '../type-guards/measurement-data-type-guard';
import {isTimeRange} from '../type-guards/time-range-guard';
import {transformDateToString, transformStringToDate} from '../utils/date-transformation.utils';

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
  private readonly historicalDateRangeKey = 'hdr' as const;

  private readonly historicalDateRangeSeparator = '-' as const;

  public transformUrlFragmentToAppUrlParameter(fragment: string | undefined): AppUrlParameter {
    const urlParams = new URLSearchParams(fragment);
    const languageString = this.transformUrlFragmentParameterToValue(urlParams, this.languageKey);
    const measurementDataTypeString = this.transformUrlFragmentParameterToValue(urlParams, this.measurementDataTypeKey);
    const dataIntervalString = this.transformUrlFragmentParameterToValue(urlParams, this.dataIntervalKey);
    const timeRangeString = this.transformUrlFragmentParameterToValue(urlParams, this.timeRangeKey);
    const historicalDateRange = this.transformHistoricalDateRangeStringToDate(urlParams.get(this.historicalDateRangeKey));
    return {
      language: languageString && isLanguage(languageString) ? languageString : languageConfig.defaultLanguage,
      measurementDataType:
        measurementDataTypeString && isMeasurementDataType(measurementDataTypeString)
          ? measurementDataTypeString
          : collectionConfig.defaultMeasurementDataType,
      parameterGroupId: this.transformUrlFragmentParameterToValue(urlParams, this.parameterGroupIdKey),
      stationId: this.transformUrlFragmentParameterToValue(urlParams, this.stationIdKey),
      collection: this.transformUrlFragmentParameterToValue(urlParams, this.collectionKey),
      dataInterval: dataIntervalString && isDataInterval(dataIntervalString) ? dataIntervalString : null,
      timeRange: timeRangeString && isTimeRange(timeRangeString) ? timeRangeString : null,
      historicalDateRange: historicalDateRange ?? null,
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

  private transformUrlFragmentParameterToValue(urlParams: URLSearchParams, key: string): string | null {
    const value = urlParams.get(key);
    return value === '' ? null : value;
  }

  private transformAppUrlParameterToUrlFragment(appUrlParameter: AppUrlParameter): string {
    const urlParams = new URLSearchParams();
    urlParams.set(this.languageKey, appUrlParameter.language);
    urlParams.set(this.measurementDataTypeKey, appUrlParameter.measurementDataType);
    urlParams.set(this.parameterGroupIdKey, appUrlParameter.parameterGroupId ?? '');
    urlParams.set(this.stationIdKey, appUrlParameter.stationId ?? '');
    urlParams.set(this.collectionKey, appUrlParameter.collection ?? '');
    urlParams.set(this.dataIntervalKey, appUrlParameter.dataInterval ?? '');
    urlParams.set(this.timeRangeKey, appUrlParameter.timeRange ?? '');
    const historicalDateRangeString = this.transformHistoricalDateRangeToString(appUrlParameter.historicalDateRange);
    urlParams.set(this.historicalDateRangeKey, historicalDateRangeString ?? '');
    return urlParams.toString();
  }

  private transformHistoricalDateRangeStringToDate(dateRangeString: string | null): DateRange | undefined {
    const dates = dateRangeString?.split(this.historicalDateRangeSeparator);
    if (dates?.length !== 2) {
      return undefined;
    }
    const fromDate = transformStringToDate(dates[0]);
    const toDate = transformStringToDate(dates[1]);
    return fromDate != null && toDate != null ? {start: fromDate, end: toDate} : undefined;
  }

  private transformHistoricalDateRangeToString(dateRange: DateRange | null): string | undefined {
    return dateRange
      ? `${transformDateToString(dateRange.start)}${this.historicalDateRangeSeparator}${transformDateToString(dateRange.end)}`
      : undefined;
  }
}
