import {selectAvailableDataInterval} from './asset.selectors';
import type {StationAsset} from '../../../shared/models/station-assets';

describe('Asset selectors', () => {
  describe('selectAvailableDataInterval', () => {
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
      const result = selectAvailableDataInterval.projector(assets);

      expect(result).toEqual(['ten-minutes', 'daily']);
    });
  });
});
