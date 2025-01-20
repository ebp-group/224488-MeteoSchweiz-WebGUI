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
  coordinatesLv95East: string;
  coordinatesLv95North: string;
  coordinatesWgs84Lat: string;
  coordinatesWgs84Lon: string;
  expositionLabel: TranslatableLabel;
  url: TranslatableLabel;
}

export interface StationParameter {
  shortname: string;
  description: TranslatableLabel;
  group: TranslatableLabel;
  granularity: 'T' | 'H' | 'D' | 'M' | 'Y';
  decimals: number;
  datatype: 'Integer' | 'Float';
  unit: string;
}

export interface StationParameterMapping {
  stationAbbreviation: string;
  parameterShortname: string;
  measCatNumber: number;
  sinceDate: string;
  tillDate: string;
  ownerOrganizationName: string;
}
