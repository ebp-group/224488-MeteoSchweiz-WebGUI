import {TimeRange, timeRanges} from '../models/time-range';

export function isTimeRange(value: string): value is TimeRange {
  return timeRanges.includes(value as TimeRange);
}
