import {ErrorHandler} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {AssetService} from './asset.service';
import {StacApiService} from './stac-api.service';
import type {StationAsset} from '../../shared/models/station-assets';

describe('AssetService', () => {
  let service: AssetService;
  let stacApiService: jasmine.SpyObj<StacApiService>;

  beforeEach(() => {
    stacApiService = jasmine.createSpyObj<StacApiService>('StacApiService', ['getAssets']);
    const errorHandler = jasmine.createSpyObj<ErrorHandler>('ErrorHandler', ['handleError']);
    errorHandler.handleError.and.callFake((error) => {
      throw error;
    });
    TestBed.configureTestingModule({
      providers: [
        {
          provide: StacApiService,
          useValue: stacApiService,
        },
        {
          provide: ErrorHandler,
          useValue: errorHandler,
        },
      ],
    });
    service = TestBed.inject(AssetService);
  });

  describe('loadCollectionAssets', () => {
    it('should get the collection assets from the stac API and transform the result', async () => {
      const collection = ['collection'];
      stacApiService.getAssets.and.resolveTo([
        {filename: `${collection}_datainventory.csv`, url: 'www.meteoschweiz.admin.ch'},
        {filename: `${collection}_parameters.csv`, url: 'www.meteoschweiz.admin.ch'},
        {filename: `${collection}_stations.csv`, url: 'www.meteoschweiz.admin.ch'},
      ]);

      const result = await service.loadCollectionAssets(collection);

      expect(result).toEqual([
        {
          filename: `${collection}_datainventory.csv`,
          url: 'www.meteoschweiz.admin.ch',
          metaFileType: 'dataInventory',
          collection: 'collection',
        },
        {
          filename: `${collection}_parameters.csv`,
          url: 'www.meteoschweiz.admin.ch',
          metaFileType: 'parameter',
          collection: 'collection',
        },
        {
          filename: `${collection}_stations.csv`,
          url: 'www.meteoschweiz.admin.ch',
          metaFileType: 'station',
          collection: 'collection',
        },
      ]);
    });
  });

  describe('loadStationAssets', () => {
    it('should get the assets for a station form the stacApiService and parse the filename', async () => {
      const collection = 'collection';
      const stationId = 'stationId';
      stacApiService.getAssets.and.resolveTo([
        {filename: `${collection}_${stationId}_t_now.csv`, url: 'www.meteoschweiz.admin.ch'},
        {filename: `${collection}_${stationId}_m_recent.csv`, url: 'www.meteoschweiz.admin.ch'},
        {filename: `${collection}_${stationId}_h_recent.csv`, url: 'www.meteoschweiz.admin.ch'},
        {filename: `${collection}_${stationId}_d_recent.csv`, url: 'www.meteoschweiz.admin.ch'},
        {filename: `${collection}_${stationId}_y_historical.csv`, url: 'www.meteoschweiz.admin.ch'},
      ]);

      const result = await service.loadStationAssets(collection, stationId);

      expect(result).toEqual([
        {filename: `${collection}_${stationId}_t_now.csv`, url: 'www.meteoschweiz.admin.ch', interval: 'ten-minutes', timeRange: 'now'},
        {filename: `${collection}_${stationId}_m_recent.csv`, url: 'www.meteoschweiz.admin.ch', interval: 'monthly', timeRange: 'recent'},
        {filename: `${collection}_${stationId}_h_recent.csv`, url: 'www.meteoschweiz.admin.ch', interval: 'hourly', timeRange: 'recent'},
        {filename: `${collection}_${stationId}_d_recent.csv`, url: 'www.meteoschweiz.admin.ch', interval: 'daily', timeRange: 'recent'},
        {
          filename: `${collection}_${stationId}_y_historical.csv`,
          url: 'www.meteoschweiz.admin.ch',
          interval: 'yearly',
          timeRange: 'historical',
          dateRange: undefined,
        },
      ] satisfies StationAsset[]);
    });

    it('should parse assets with explicit time range', async () => {
      const collection = 'collection';
      const stationId = 'stationId';
      stacApiService.getAssets.and.resolveTo([
        {filename: `${collection}_${stationId}_t_historical_1991-2000.csv`, url: 'www.meteoschweiz.admin.ch'},
        {filename: `${collection}_${stationId}_t_historical_2001-2010.csv`, url: 'www.meteoschweiz.admin.ch'},
        {filename: `${collection}_${stationId}_t_historical_2011-2020.csv`, url: 'www.meteoschweiz.admin.ch'},
      ]);

      const result = await service.loadStationAssets(collection, stationId);

      expect(result).toEqual(
        jasmine.arrayWithExactContents([
          {
            filename: `${collection}_${stationId}_t_historical_1991-2000.csv`,
            url: 'www.meteoschweiz.admin.ch',
            interval: 'ten-minutes',
            timeRange: 'historical',
            dateRange: {start: jasmine.any(Date), end: jasmine.any(Date)},
          },
          {
            filename: `${collection}_${stationId}_t_historical_2001-2010.csv`,
            url: 'www.meteoschweiz.admin.ch',
            interval: 'ten-minutes',
            timeRange: 'historical',
            dateRange: {start: jasmine.any(Date), end: jasmine.any(Date)},
          },
          {
            filename: `${collection}_${stationId}_t_historical_2011-2020.csv`,
            url: 'www.meteoschweiz.admin.ch',
            interval: 'ten-minutes',
            timeRange: 'historical',
            dateRange: {start: jasmine.any(Date), end: jasmine.any(Date)},
          },
        ]),
      );
    });

    it('should parse filenames with no timeRange (no-type)', async () => {
      const collection = 'collection';
      const stationId = 'stationId';
      stacApiService.getAssets.and.resolveTo([
        {filename: `${collection}_${stationId}_t.csv`, url: 'www.meteoschweiz.admin.ch'},
        {filename: `${collection}_${stationId}_m.csv`, url: 'www.meteoschweiz.admin.ch'},
        {filename: `${collection}_${stationId}_y.csv`, url: 'www.meteoschweiz.admin.ch'},
      ]);

      const result = await service.loadStationAssets(collection, stationId);

      expect(result).toEqual([
        {
          filename: `${collection}_${stationId}_t.csv`,
          url: 'www.meteoschweiz.admin.ch',
          interval: 'ten-minutes',
          timeRange: 'historical',
          dateRange: undefined,
        },
        {
          filename: `${collection}_${stationId}_m.csv`,
          url: 'www.meteoschweiz.admin.ch',
          interval: 'monthly',
          timeRange: 'historical',
          dateRange: undefined,
        },
        {
          filename: `${collection}_${stationId}_y.csv`,
          url: 'www.meteoschweiz.admin.ch',
          interval: 'yearly',
          timeRange: 'historical',
          dateRange: undefined,
        },
      ] satisfies StationAsset[]);
    });
  });
});
