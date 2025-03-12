import {DataInterval, dataIntervals} from '../models/interval';

export function isDataInterval(value: string): value is DataInterval {
  return dataIntervals.includes(value as DataInterval);
}
