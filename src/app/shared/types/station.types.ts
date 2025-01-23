import {TranslatableLabel} from './translatable-label';

export interface Station {
  abbreviation: string;
  name: string;
  canton: string;
  wigosId: string;
  typeLabel: TranslatableLabel;
  dataOwner: string;
  dataSince: string;
  heightMasl: string;
  heightBarometerMasl: string;
  coordinatesLv95East: number;
  coordinatesLv95North: number;
  coordinatesWgs84Lat: number;
  coordinatesWgs84Lon: number;
  expositionLabel: TranslatableLabel;
  url: TranslatableLabel;
}

const assetInterval = ['T', 'H', 'D', 'M', 'Y'] as const;
export type AssetInterval = (typeof assetInterval)[number];
export function isAssetInterval(value: string): value is AssetInterval {
  return assetInterval.find((interval) => interval === value) != null;
}

export interface StationParameter {
  /*
    shortname has the form of <some id><interval><type of measurement>
    <interval>             "d", "h", "z", "m", "y", "s"
        d: day
        h: hour
        z: ten-minute
        m: month
        y: year
        s: moment
      -> This data is also represented in the granularity field
    <type of measurement>  "0", "1", "3", "s", "v", "n", "x"
        0: mean/total/average/current value
        1: max for 1-sekunden böe (for special parameter)
        3: max for 3-sekunden böe (for special parameter)
        s: " hourly current value" 
        v: " in relation to absolute daily total", " relation of the monthly total to the possible maximum", " relation of the annual total to the possible maximum"
        n: minimum
        x: maximum
      -> This data might be not needed in the end
  */
  shortname: string;
  // This has the form of <some_name>;<interval>
  // <some_name> is shared between certain parameters
  // <interval> seems to be standardized to some degree but there are also different one that look similar
  // Exceptions:
  //    Föhnindex, Tageswert    (not quoted in the csv so , instead of ;)(also not consistent with the other translations)
  //    Föhnindex               (just no ; at all)(same in all translations)
  // shortname seems to also reflect this info and seems to be more reliable
  // sometimes the interval part of the the description describes how a parameter distinguishes from other similar parameters

  description: TranslatableLabel;

  // This has a more generic name for the parameters
  group: TranslatableLabel;
  granularity: AssetInterval;
  decimals: number;
  datatype: 'Integer' | 'Float';
  unit: string;

  id?: string; // the first 6 characters of shortname
  name?: TranslatableLabel;
  measurementType?: '0' | '1' | '3' | 's' | 'v' | 'n' | 'x'; // this might be not needed in the end
}

export interface StationParameterGroup {
  name: TranslatableLabel;
  parameters: StationParameter[];
}

export interface StationParameterMapping {
  stationAbbreviation: string;
  parameterShortname: string;
  measCatNumber: number;
  sinceDate: string;
  tillDate: string;
  ownerOrganizationName: string;
}

export interface StationAsset {
  name: string;
  href: string;
  description: string; // TODO: Should we use this? It's only english
  interval: AssetInterval;
  // There's a checksum. That could also be provided maybe
}
