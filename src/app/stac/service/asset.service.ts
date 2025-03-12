import {inject, Injectable} from '@angular/core';
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

  private readonly parseRegex =
    /^(?<collectionId>[^_]+)_(?<stationId>[^_]+)_(?<interval>[^_]+)_(?<timeRange>[^_]+)(?:_(?<fromDate>\d{8})_(?<toDate>\d{8}))?\.csv$/;

  public async loadStationAssets(collection: string, stationId: string): Promise<StationAsset[]> {
    const assets = await this.stacApiService.getStationAssets(collection, stationId);
    return assets
      .map((asset) => {
        try {
          return this.parseStacStationAsset(asset);
        } catch (error: unknown) {
          console.error(error);
          return undefined;
        }
      })
      .filter((asset) => asset != null);
  }

  private parseStacStationAsset(asset: StacStationAsset): StationAsset {
    const matches = RegExp(this.parseRegex).exec(asset.filename);
    if (!matches) {
      // TODO: Error handling
      throw new AssetParseError();
    }

    const interval = this.transformInterval(matches.groups?.['interval'] as string);
    const timeRange = this.transformTimeRange(matches.groups?.['timeRange'] as string);

    if (timeRange === 'historical') {
      const fromDate = this.transformDate(matches.groups?.['fromDate']);
      const toDate = this.transformDate(matches.groups?.['toDate']);
      const dataRange = fromDate != null && toDate != null ? {start: fromDate, end: toDate} : undefined;
      return {
        filename: asset.filename,
        url: asset.url ?? '',
        interval,
        timeRange: timeRange,
        dateRange: dataRange,
      };
    } else {
      return {
        filename: asset.filename,
        url: asset.url ?? '',
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
        // TODO: Error handling
        throw new AssetParseError();
    }
  }

  private transformTimeRange(timeRange: string): TimeRange {
    if (isTimeRange(timeRange)) {
      return timeRange;
    }
    // TODO: Error handling
    throw new AssetParseError();
  }

  private transformDate(date: string | undefined): Date | undefined {
    // TODO: Error handling
    if (!date) {
      return undefined;
    }
    const year = date.substring(0, 4);
    const month = date.substring(4, 6);
    const day = date.substring(6, 8);

    // Note: months are 0-indexed in JavaScript Date objects
    return new Date(Number(year), Number(month) - 1, Number(day));
  }
}
