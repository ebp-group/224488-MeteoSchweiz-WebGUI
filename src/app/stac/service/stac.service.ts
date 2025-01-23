import {inject, Injectable} from '@angular/core';
import papa from 'papaparse';
import {
  isAssetInterval,
  Station,
  StationAsset,
  StationParameter,
  StationParameterGroup,
  StationParameterMapping,
} from '../../shared/types/station.types';
import {Store} from '@ngrx/store';
import {stationActions} from '../../state/station/actions/station.actions';
import {Api as StacApiClient} from '../generated/stac-api.generated';
import {formFeature} from '../../state/form/reducers/form.reducer';
import {formActions} from '../../state/form/actions/form.actions';

interface CsvStation {
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

interface CsvParameter {
  parameterShortname: string;
  parameterDescriptionDe: string;
  parameterDescriptionFr: string;
  parameterDescriptionIt: string;
  parameterDescriptionEn: string;
  parameterGroupDe: string;
  parameterGroupFr: string;
  parameterGroupIt: string;
  parameterGroupEn: string;
  parameterGranularity: 'T' | 'H' | 'D' | 'M' | 'Y';
  parameterDecimals: `${number}`;
  parameterDatatype: 'Integer' | 'Float';
  parameterUnit: string;
}

interface CsvStationParameterMapping {
  stationNatAbbrTx: string;
  paramShortNameTx: string;
  measCatNr: `${number}`;
  sinceDt: string;
  tillDt: string;
  ownerOrgNameTx: string;
}

@Injectable({
  providedIn: 'root',
})
export class StacService {
  // Need to augment collection type with `assets: ItemAssets` to return the links
  // - functions to return link to metadata.
  //   metadata will be used to find all the stations and parameters available
  // - get item
  //    need to be able to search based on date, interval etc
  // I guess we only need the ch.meteoschweiz.ogd-smn collection
  private readonly store = inject(Store);

  private readonly meteoSchweizCollection = 'ch.meteoschweiz.ogd-smn';
  private readonly stacApiServer = 'sys-data.int.bgdi.ch';

  private readonly stacApiClient: StacApiClient<unknown>;

  constructor() {
    this.stacApiClient = new StacApiClient();
    this.stacApiClient.baseUrl = 'https://sys-data.int.bgdi.ch/api/stac/v0.9';
  }

  public async fetchAssetsForStation(station: Station): Promise<void> {
    console.log(station);
    const feature = await this.stacApiClient.collections.getFeature(this.meteoSchweizCollection, station.abbreviation.toLowerCase(), {
      format: 'json',
    });
    const results: StationAsset[] = [];
    const assets = feature.data.assets;
    for (const assetKey in assets) {
      // TODO: null handling
      const asset = assets[assetKey];
      const granularity = assetKey.split('_')[2].toUpperCase();
      if (isAssetInterval(granularity)) {
        results.push({name: assetKey, description: asset.description!, href: asset.href!, interval: granularity});
      } else {
        console.error('Could not parse asset granularity', asset);
      }
    }
    console.log(assets);
    this.store.dispatch(formActions.selectAssetsFormSelectedStation({assets: results}));
  }

  public fetchAll() {
    this.fetchCSV<CsvStation>(`https://${this.stacApiServer}/${this.meteoSchweizCollection}/ogd-smn_meta_stations.csv`, (result) => {
      const stations = result.map(this.transformCsvStationToStation);
      // Test station that has assets to link to
      stations.push({
        abbreviation: 'HAI',
        canton: 'TG',
        coordinatesLv95East: 2719099.786,
        coordinatesLv95North: 1279046.619,
        coordinatesWgs84Lat: 47.651242,
        coordinatesWgs84Lon: 9.023911,
        dataOwner: '',
        dataSince: '',
        expositionLabel: {
          de: '',
          en: '',
          fr: '',
          it: '',
        },
        heightBarometerMasl: '',
        heightMasl: '',
        name: 'Salen-Reutenen',
        typeLabel: {
          de: '',
          en: '',
          fr: '',
          it: '',
        },
        url: {
          de: '',
          en: '',
          fr: '',
          it: '',
        },
        wigosId: '',
      });
      this.store.dispatch(stationActions.setStations({stations}));
    });
    this.fetchCSV<CsvParameter>(`https://${this.stacApiServer}/${this.meteoSchweizCollection}/ogd-smn_meta_parameters.csv`, (result) => {
      const parameters = result.map(this.transformCsvParameterToStationParameter);
      const groups = this.processParameters(parameters);
      // eslint-disable-next-line @ngrx/avoid-dispatching-multiple-actions-sequentially
      this.store.dispatch(stationActions.setParameters({parameters: parameters}));
      // eslint-disable-next-line @ngrx/avoid-dispatching-multiple-actions-sequentially
      this.store.dispatch(stationActions.setParameterGroups({groups: groups}));
    });
    this.fetchCSV<CsvStationParameterMapping>(
      `https://${this.stacApiServer}/${this.meteoSchweizCollection}/ogd-smn_meta_datainventory.csv`,
      (result) =>
        this.store.dispatch(
          stationActions.setStationParameterMappings({
            mappings: result.map(this.transformCsvStationParameterMappingToStationParameterMapping),
          }),
        ),
    );
  }

  private processParameters(parameters: StationParameter[]): StationParameterGroup[] {
    const groups = new Map<string, StationParameterGroup>();
    for (const parameter of parameters) {
      if (!groups.has(parameter.group.en)) {
        groups.set(parameter.group.en, {name: parameter.group, parameters: []});
      }
      groups.get(parameter.group.en)?.parameters.push(parameter);
    }
    const apiArray = Array.from(groups.values());
    apiArray.push({name: {de: 'Test ohne parameter', en: 'Test without parameter', fr: 'Test', it: 'Test'}, parameters: []});
    return apiArray;
  }

  private fetchCSV<T>(url: string, resultCallback: (result: T[]) => void) {
    //TODO: decode windows-1252 characters or change the csv to utf-8
    papa.parse<T>(url, {
      download: true,
      delimiter: ';',
      header: true,
      skipEmptyLines: true,
      transformHeader: (header, index) => {
        if (header.includes('_')) {
          // Transform header is called multiple times for the same header. We only have to perform the transformation once
          header = header.toLowerCase().replace(/(_\w)/g, (group) => group[1].toUpperCase());
        }
        // console.log(header, index);
        return header;
      },
      complete: (result) => {
        // console.log(result);
        resultCallback(result.data);
      },
    });
  }

  private transformCsvStationToStation(csvStation: CsvStation): Station {
    return {
      abbreviation: csvStation.stationAbbr,
      canton: csvStation.stationCanton,
      coordinatesLv95East: Number.parseFloat(csvStation.stationCoordinatesLv95East),
      coordinatesLv95North: Number.parseFloat(csvStation.stationCoordinatesLv95North),
      coordinatesWgs84Lat: Number.parseFloat(csvStation.stationCoordinatesWgs84Lat),
      coordinatesWgs84Lon: Number.parseFloat(csvStation.stationCoordinatesWgs84Lon),
      dataOwner: csvStation.stationDataowner,
      dataSince: csvStation.stationDataSince,
      expositionLabel: {
        de: csvStation.stationExpositionDe,
        en: csvStation.stationExpositionEn,
        fr: csvStation.stationExpositionFr,
        it: csvStation.stationExpositionIt,
      },
      heightBarometerMasl: csvStation.stationHeightBarometerMasl,
      heightMasl: csvStation.stationHeightMasl,
      name: csvStation.stationName,
      typeLabel: {
        de: csvStation.stationTypeDe,
        en: csvStation.stationTypeEn,
        fr: csvStation.stationTypeFr,
        it: csvStation.stationTypeIt,
      },
      url: {
        de: csvStation.stationUrlDe,
        en: csvStation.stationUrlEn,
        fr: csvStation.stationUrlFr,
        it: csvStation.stationUrlIt,
      },
      wigosId: csvStation.stationWigosId,
    };
  }

  private transformCsvParameterToStationParameter(csvParameter: CsvParameter): StationParameter {
    return {
      datatype: csvParameter.parameterDatatype,
      decimals: Number.parseInt(csvParameter.parameterDecimals),
      description: {
        de: csvParameter.parameterDescriptionDe,
        en: csvParameter.parameterDescriptionEn,
        fr: csvParameter.parameterDescriptionFr,
        it: csvParameter.parameterDescriptionIt,
      },
      granularity: csvParameter.parameterGranularity,
      group: {
        de: csvParameter.parameterGroupDe,
        en: csvParameter.parameterGroupEn,
        fr: csvParameter.parameterGroupFr,
        it: csvParameter.parameterGroupIt,
      },
      shortname: csvParameter.parameterShortname,
      unit: csvParameter.parameterUnit,
    };
  }

  private transformCsvStationParameterMappingToStationParameterMapping(mapping: CsvStationParameterMapping): StationParameterMapping {
    return {
      stationAbbreviation: mapping.stationNatAbbrTx,
      parameterShortname: mapping.paramShortNameTx,
      measCatNumber: Number.parseInt(mapping.measCatNr),
      sinceDate: mapping.sinceDt,
      tillDate: mapping.tillDt,
      ownerOrganizationName: mapping.ownerOrgNameTx,
    };
  }
}
/*
Data flow
- get metadata for stations, and parameters
  - need to parse csv for this
- show stations on the map
- show available parameters
- 
*/
