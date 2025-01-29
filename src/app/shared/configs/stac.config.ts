import {StacClientConfig} from '../models/stac-config.types';

export const defaultStacClientConfig: StacClientConfig = {
  baseUrl: 'https://sys-data.int.bgdi.ch/api/stac/v1',
  csvDelimiter: ';',
};
