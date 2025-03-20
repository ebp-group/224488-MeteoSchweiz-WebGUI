import {ErrorHandler, inject, Injectable} from '@angular/core';
import {AssetParseError} from '../../shared/errors/asset.error';
import {isTimeRange} from '../../shared/type-guards/time-range-guard';
import {StacApiService} from './stac-api.service';
import type {DataInterval} from '../../shared/models/interval';
import type {StationAsset} from '../../shared/models/station-assets';
import type {TimeRange} from '../../shared/models/time-range';
import type {StacStationAsset} from '../models/stac-station-asset';

@Injectable({
  providedIn: 'root',
})
export class AssetService {
  private readonly stacApiService = inject(StacApiService);
  private readonly errorHandler = inject(ErrorHandler);

  private readonly parseRegex =
    /^(?<collectionId>[^_]+)_(?<stationId>[^_]+)_(?<interval>[^_]+)_(?<timeRange>[^_]+)(?:_(?<fromDate>\d{8})_(?<toDate>\d{8}))?\.csv$/;

  public async loadStationAssets(collection: string, stationId: string): Promise<StationAsset[]> {
    const assets = await this.stacApiService.getStationAssets(collection, stationId);
    return assets
      .map((asset) => {
        try {
          return this.parseStacStationAsset(asset);
        } catch (error: unknown) {
          if (error instanceof AssetParseError) {
            error.translationArguments = {filename: asset.filename};
          }
          this.errorHandler.handleError(error);
          return undefined;
        }
      })
      .filter((asset) => asset != null);
  }

  private parseStacStationAsset(asset: StacStationAsset): StationAsset {
    if (!asset.url) {
      throw new AssetParseError();
    }

    const matches = RegExp(this.parseRegex).exec(asset.filename);
    if (!matches || !matches.groups) {
      throw new AssetParseError();
    }

    const interval = this.transformInterval(matches.groups['interval']);
    const timeRange = this.transformTimeRange(matches.groups['timeRange']);

    switch (timeRange) {
      case 'historical': {
        const fromDate = this.transformDate(matches.groups['fromDate']);
        const toDate = this.transformDate(matches.groups['toDate']);
        const dataRange = fromDate != null && toDate != null ? {start: fromDate, end: toDate} : undefined;
        return {
          filename: asset.filename,
          url: asset.url,
          interval,
          timeRange: timeRange,
          dateRange: dataRange,
        };
      }
      case 'now':
      case 'recent':
        return {
          filename: asset.filename,
          url: asset.url,
          interval,
          timeRange: timeRange,
        };
    }
  }

  private transformInterval(interval: string): DataInterval {
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
        throw new AssetParseError();
    }
  }

  private transformTimeRange(timeRange: string): TimeRange {
    if (!isTimeRange(timeRange)) {
      throw new AssetParseError();
    }
    return timeRange;
  }

  private transformDate(date: string | undefined): Date | undefined {
    if (!date) {
      return undefined;
    }
    const year = Number(date.substring(0, 4));
    const month = Number(date.substring(4, 6));
    const day = Number(date.substring(6, 8));

    if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
      throw new AssetParseError();
    }

    // Note: months are 0-indexed in JavaScript Date objects
    return new Date(year, month - 1, day);
  }
}
