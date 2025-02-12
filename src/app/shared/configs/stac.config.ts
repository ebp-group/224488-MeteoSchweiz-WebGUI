import {type StacClientConfig} from '../models/configs/stac-config';

export const defaultStacClientConfig = {
  baseUrl: 'https://sys-data.int.bgdi.ch/api/stac/v1',
  csvDelimiter: ';',
} as const satisfies StacClientConfig;
