import type {StacClientConfig} from '../models/configs/stac-config';

export const stacClientConfig = {
  baseUrl: 'https://data.geo.admin.ch/api/stac/v1',
  csvDelimiter: ';',
  encoding: 'windows-1252',
} as const satisfies StacClientConfig;
