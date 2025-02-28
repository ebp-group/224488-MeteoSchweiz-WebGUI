import {CollectionsConfig} from '../models/configs/collections-config';

export const collectionConfig = {
  collections: {
    normal: [
      'ch.meteoschweiz.ogd-smn',
      'ch.meteoschweiz.ogd-smn-precip',
      'ch.meteoschweiz.ogd-smn-tower',
      'ch.meteoschweiz.ogd-nime',
      'ch.meteoschweiz.ogd-tot',
      'ch.meteoschweiz.ogd-pollen',
      'ch.meteoschweiz.ogd-obs',
      'ch.meteoschweiz.ogd-phenology',
    ],
    homogenous: ['ch.meteoschweiz.ogd-nbcn', 'ch.meteoschweiz.ogd-nbcn-precip'],
  },
  defaultMeasurementDataType: 'normal',
} as const satisfies CollectionsConfig;
