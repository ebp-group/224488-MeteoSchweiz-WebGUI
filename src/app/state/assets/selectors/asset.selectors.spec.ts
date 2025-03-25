import {
  selectAssetsFilteredBySelectedInterval,
  selectAvailableDataIntervals,
  selectAvailableTimeRanges,
  selectSortedHistoricalDateRanges,
} from './asset.selectors';
import type {StationAsset} from '../../../shared/models/station-assets';

describe('Asset selectors', () => {
  describe('selectAvailableDataIntervals', () => {
    it('should return an array containing all available dataIntervals from assets', () => {
      const assets: StationAsset[] = [
        {
          filename: '',
          timeRange: 'now',
          url: '',
          interval: 'ten-minutes',
        },
        {
          filename: '',
          timeRange: 'now',
          url: '',
          interval: 'ten-minutes',
        },
        {
          filename: '',
          timeRange: 'now',
          url: '',
          interval: 'daily',
        },
      ];
      const result = selectAvailableDataIntervals.projector(assets);

      expect(result).toEqual(['ten-minutes', 'daily']);
    });
  });

  describe('selectAssetsFilteredBySelectedInterval', () => {
    it('should only get assets from selected interval', () => {
      const assets: StationAsset[] = [
        {
          filename: '',
          timeRange: 'historical',
          url: '',
          interval: 'daily',
          dateRange: {
            start: new Date('202401-01T00:00'),
            end: new Date('2024-01-01T00:00'),
          },
        },
        {
          filename: '',
          timeRange: 'historical',
          url: '',
          interval: 'ten-minutes',
          dateRange: {
            start: new Date('2025-01-01T00:00'),
            end: new Date('2025-01-01T00:00'),
          },
        },
      ];
      const result = selectAssetsFilteredBySelectedInterval.projector(assets, 'ten-minutes');

      expect(result).toEqual(
        jasmine.arrayWithExactContents([
          {
            filename: '',
            timeRange: 'historical',
            url: '',
            interval: 'ten-minutes',
            dateRange: {
              start: new Date('2025-01-01T00:00'),
              end: new Date('2025-01-01T00:00'),
            },
          },
        ]),
      );
    });
  });

  describe('selectAvailableTimeRanges', () => {
    it('should return an array containing all unique available time ranges from assets ignoring dateRanges', () => {
      const assets: StationAsset[] = [
        {
          filename: '',
          timeRange: 'recent',
          url: '',
          interval: 'ten-minutes',
        },
        {
          filename: '',
          timeRange: 'historical',
          url: '',
          interval: 'ten-minutes',
          dateRange: undefined,
        },
        {
          filename: '',
          timeRange: 'historical',
          url: '',
          interval: 'ten-minutes',
          dateRange: {
            start: new Date(),
            end: new Date(),
          },
        },
      ];
      const result = selectAvailableTimeRanges.projector(assets);

      expect(result).toEqual(jasmine.arrayWithExactContents(['historical', 'recent']));
    });
  });

  describe('selectSortedHistoricalDateRanges', () => {
    it('should get all DateRanges from historical assets ignoring those that are not set', () => {
      const assets: StationAsset[] = [
        {
          filename: '',
          timeRange: 'historical',
          url: '',
          interval: 'ten-minutes',
          dateRange: undefined,
        },
        {
          filename: '',
          timeRange: 'historical',
          url: '',
          interval: 'ten-minutes',
          dateRange: {
            start: new Date('2025-01-01T00:00'),
            end: new Date('2025-01-01T00:00'),
          },
        },
      ];
      const result = selectSortedHistoricalDateRanges.projector(assets, null);

      expect(result).toEqual(
        jasmine.arrayWithExactContents([{start: new Date('2025-01-01T00:00'), end: new Date('2025-01-01T00:00'), selected: false}]),
      );
    });

    it('should sort the entries from new to old', () => {
      const assets: StationAsset[] = [
        {
          filename: '',
          timeRange: 'historical',
          url: '',
          interval: 'ten-minutes',
          dateRange: {
            start: new Date('2024-01-01T00:00'),
            end: new Date('2024-01-01T00:00'),
          },
        },
        {
          filename: '',
          timeRange: 'historical',
          url: '',
          interval: 'ten-minutes',
          dateRange: {
            start: new Date('2025-01-01T00:00'),
            end: new Date('2025-01-01T00:00'),
          },
        },
        {
          filename: '',
          timeRange: 'historical',
          url: '',
          interval: 'ten-minutes',
          dateRange: {
            start: new Date('2023-01-01T00:00'),
            end: new Date('2023-01-01T00:00'),
          },
        },
      ];
      const result = selectSortedHistoricalDateRanges.projector(assets, null);

      expect(result).toEqual([
        {start: new Date('2025-01-01T00:00'), end: new Date('2025-01-01T00:00'), selected: false},
        {start: new Date('2024-01-01T00:00'), end: new Date('2024-01-01T00:00'), selected: false},
        {start: new Date('2023-01-01T00:00'), end: new Date('2023-01-01T00:00'), selected: false},
      ]);
    });

    it('should set the correct asset as selected', () => {
      const assets: StationAsset[] = [
        {
          filename: '',
          timeRange: 'historical',
          url: '',
          interval: 'ten-minutes',
          dateRange: {
            start: new Date('2024-01-01T00:00'),
            end: new Date('2024-01-01T00:00'),
          },
        },
        {
          filename: '',
          timeRange: 'historical',
          url: '',
          interval: 'ten-minutes',
          dateRange: {
            start: new Date('2025-01-01T00:00'),
            end: new Date('2025-01-01T00:00'),
          },
        },
        {
          filename: '',
          timeRange: 'historical',
          url: '',
          interval: 'ten-minutes',
          dateRange: {
            start: new Date('2023-01-01T00:00'),
            end: new Date('2023-01-01T00:00'),
          },
        },
      ];
      const result = selectSortedHistoricalDateRanges.projector(assets, {
        start: new Date('2023-01-01T00:00'),
        end: new Date('2023-01-01T00:00'),
      });

      expect(result).toEqual(
        jasmine.arrayWithExactContents([
          {start: new Date('2025-01-01T00:00'), end: new Date('2025-01-01T00:00'), selected: false},
          {start: new Date('2024-01-01T00:00'), end: new Date('2024-01-01T00:00'), selected: false},
          {start: new Date('2023-01-01T00:00'), end: new Date('2023-01-01T00:00'), selected: true},
        ]),
      );
    });
  });
});
