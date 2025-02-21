export interface CsvStation {
  stationAbbr: string;
  stationName: string;
  stationCanton: string;
  stationWigosId: string;
  stationTypeDe: string;
  stationTypeFr: string;
  stationTypeIt: string;
  stationTypeEn: string;
  stationDataowner: string;
  stationDataSince: string;
  stationHeightMasl: string;
  stationHeightBarometerMasl: string;
  stationCoordinatesLv95East: `${number}`;
  stationCoordinatesLv95North: `${number}`;
  stationCoordinatesWgs84Lat: `${number}`;
  stationCoordinatesWgs84Lon: `${number}`;
  stationExpositionDe: string;
  stationExpositionFr: string;
  stationExpositionIt: string;
  stationExpositionEn: string;
  stationUrlDe: string;
  stationUrlFr: string;
  stationUrlIt: string;
  stationUrlEn: string;
}
