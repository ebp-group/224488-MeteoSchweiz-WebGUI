import {createSelector} from '@ngrx/store';
import {DateRange} from '../../../shared/models/date-range';
import {formFeature} from '../../form/reducers/form.reducer';
import {assetFeature} from '../reducers/asset.reducer';
import type {DataInterval} from '../../../shared/models/interval';
import type {StationAsset} from '../../../shared/models/station-assets';
import type {TimeRange} from '../../../shared/models/time-range';

export const selectAvailableDataIntervals = createSelector(assetFeature.selectAssets, (assets): DataInterval[] => {
  return assets ? [...new Set(assets.map((asset) => asset.interval))] : [];
});

export const selectAssetsFilteredBySelectedInterval = createSelector(
  assetFeature.selectAssets,
  formFeature.selectSelectedDataInterval,
  (assets, interval): StationAsset[] => assets?.filter((asset) => asset.interval === interval) ?? [],
);

export const selectAvailableTimeRanges = createSelector(selectAssetsFilteredBySelectedInterval, (assets): TimeRange[] => [
  ...new Set(assets.map((asset) => asset.timeRange)),
]);

export const selectSortedHistoricalDateRanges = createSelector(
  selectAssetsFilteredBySelectedInterval,
  formFeature.selectSelectedHistoricalDateRange,
  (assets, selectedHistoricalDateRange): (DateRange & {selected: boolean})[] =>
    assets
      ?.filter((asset) => asset.timeRange === 'historical')
      .map((asset) => asset.dateRange)
      .filter((dateRange) => !!dateRange)
      .sort((range1, range2) => range2.start.getTime() - range1.start.getTime())
      .map((dateRange) => ({
        ...dateRange,
        selected:
          selectedHistoricalDateRange != null &&
          selectedHistoricalDateRange.start.getTime() === dateRange.start.getTime() &&
          selectedHistoricalDateRange.end.getTime() === dateRange.end.getTime(),
      })) ?? [],
);

export const selectSelectedAsset = createSelector(
  assetFeature.selectAssets,
  formFeature.selectSelectedDataInterval,
  formFeature.selectSelectedTimeRange,
  formFeature.selectSelectedHistoricalDateRange,
  (assets, interval, timeRange, historicalDateRange): StationAsset | undefined =>
    assets?.find(
      (asset) =>
        asset.interval === interval &&
        asset.timeRange === timeRange &&
        (asset.timeRange !== 'historical' ||
          historicalDateRange === null ||
          (asset.dateRange?.start.getTime() === historicalDateRange.start.getTime() &&
            asset.dateRange?.end.getTime() === historicalDateRange.end.getTime())),
    ),
);
