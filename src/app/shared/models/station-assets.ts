import {DateRange} from './date-range';
import type {DataInterval} from './interval';
import type {TimeRange} from './time-range';

interface BaseStationAsset {
  filename: string;
  url: string;
  interval: DataInterval;
  timeRange: TimeRange;
}

interface HistoricalStationAsset extends BaseStationAsset {
  timeRange: 'historical';
  dateRange: DateRange | undefined;
}

interface NowAndRecentStationAsset extends BaseStationAsset {
  timeRange: 'now' | 'recent';
}

export type StationAsset = HistoricalStationAsset | NowAndRecentStationAsset;
