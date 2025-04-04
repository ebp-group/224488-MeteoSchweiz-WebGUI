import {ErrorHandler, inject, Injectable} from '@angular/core';
import {AssetParseError} from '../../shared/errors/asset.error';
import {DateRange} from '../../shared/models/date-range';
import {isTimeRange} from '../../shared/type-guards/time-range-guard';
import {transformStringToDate} from '../../shared/utils/date-transformation.utils';
import {StacApiService} from './stac-api.service';
import type {CollectionAsset} from '../../shared/models/collection-assets';
import type {DataInterval} from '../../shared/models/interval';
import type {StationAsset} from '../../shared/models/station-assets';
import type {TimeRange} from '../../shared/models/time-range';
import type {StacAsset} from '../models/stac-asset';

@Injectable({
  providedIn: 'root',
})
export class AssetService {
  private readonly stacApiService = inject(StacApiService);
  private readonly errorHandler = inject(ErrorHandler);

  private readonly stationParseRegex =
    /^(?<collectionId>[^_]+)_(?<stationId>[^_]+)_(?<interval>[^_]+)_(?<timeRange>[^_]+)(?:_(?<fromDate>\d{8})_(?<toDate>\d{8}))?\.csv$/;

  public async loadCollectionAssets(collections: string[]): Promise<CollectionAsset[]> {
    const assets = await Promise.all(
      collections.map(async (collection) =>
        (await this.stacApiService.getAssets(collection)).map((asset) => this.transformStacCollectionAsset(collection, asset)),
      ),
    );
    return assets.flat();
  }

  public async loadStationAssets(collection: string, stationId: string): Promise<StationAsset[]> {
    const assets = await this.stacApiService.getAssets(collection, stationId);
    return assets
      .map((asset) => {
        try {
          return this.parseStacStationAsset(asset);
        } catch (error: unknown) {
          this.errorHandler.handleError(error);
          return undefined;
        }
      })
      .filter((asset) => asset != null);
  }

  private transformStacCollectionAsset(collection: string, asset: StacAsset): CollectionAsset {
    if (!asset.url) {
      throw new AssetParseError(asset.filename);
    }
    let metaFileType: CollectionAsset['metaFileType'] = undefined;
    if (asset.filename.includes('station')) {
      metaFileType = 'station';
    } else if (asset.filename.includes('parameter')) {
      metaFileType = 'parameter';
    } else if (asset.filename.includes('datainventory')) {
      metaFileType = 'dataInventory';
    }

    return {
      metaFileType,
      filename: asset.filename,
      url: asset.url,
      collection: collection,
    };
  }

  private parseStacStationAsset(asset: StacAsset): StationAsset {
    if (!asset.url) {
      throw new AssetParseError(asset.filename);
    }

    const matches = RegExp(this.stationParseRegex).exec(asset.filename);
    if (!matches?.groups) {
      throw new AssetParseError(asset.filename);
    }

    const interval = this.transformInterval(matches.groups['interval'], asset.filename);
    const timeRange = this.transformTimeRange(matches.groups['timeRange'], asset.filename);

    switch (timeRange) {
      case 'historical': {
        const dateRange = this.transformHistoricalDateStringsToDate(matches.groups['fromDate'], matches.groups['toDate'], asset.filename);
        return {
          filename: asset.filename,
          url: asset.url,
          interval,
          timeRange,
          dateRange,
        };
      }
      case 'now':
      case 'recent':
        return {
          filename: asset.filename,
          url: asset.url,
          interval,
          timeRange,
        };
    }
  }

  private transformInterval(interval: string, assetFilename: string): DataInterval {
    switch (interval) {
      case 't':
        return 'ten-minutes';
      case 'd':
        return 'daily';
      case 'm':
        return 'monthly';
      case 'y':
        return 'yearly';
      case 'h':
        return 'hourly';
      default:
        throw new AssetParseError(assetFilename);
    }
  }

  private transformTimeRange(timeRange: string, assetFilename: string): TimeRange {
    if (!isTimeRange(timeRange)) {
      throw new AssetParseError(assetFilename);
    }
    return timeRange;
  }

  private transformHistoricalDateStringsToDate(
    fromDateString: string | undefined,
    toDateString: string | undefined,
    assetFilename: string,
  ): DateRange | undefined {
    if (!fromDateString || !toDateString) {
      return undefined;
    }
    const fromDate = transformStringToDate(fromDateString);
    const toDate = transformStringToDate(toDateString);
    if (!fromDate || !toDate) {
      throw new AssetParseError(assetFilename);
    }
    return {start: fromDate, end: toDate};
  }
}
