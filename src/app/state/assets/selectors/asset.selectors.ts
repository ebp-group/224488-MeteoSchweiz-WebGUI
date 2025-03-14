import {createSelector} from '@ngrx/store';
import {DateRange} from '../../../shared/models/date-range';
import {formFeature} from '../../form/reducers/form.reducer';
import {assetFeature} from '../reducers/asset.reducer';
import type {DataInterval} from '../../../shared/models/interval';
import type {TimeRange} from '../../../shared/models/time-range';

export const selectAvailableDataInterval = createSelector(assetFeature.selectAssets, (assets): DataInterval[] => {
  return [...new Set(assets?.map((asset) => asset.interval))];
});

export const selectAvailableTimeRanges = createSelector(
  assetFeature.selectAssets,
  formFeature.selectSelectedDataInterval,
  (assets, interval): TimeRange[] => [...new Set(assets?.filter((asset) => asset.interval === interval).map((asset) => asset.timeRange))],
);

export const selectSortedHistoricalDateRanges = createSelector(
  assetFeature.selectAssets,
  formFeature.selectSelectedDataInterval,
  (assets, interval): DateRange[] =>
    assets
      ?.filter((asset) => asset.interval === interval)
      .filter((asset) => asset.timeRange === 'historical')
      .map((asset) => asset.dateRange)
      .filter((dateRange) => !!dateRange)
      .sort((range1, range2) => range2.start.getTime() - range1.start.getTime()) ?? [],
);
