import {createActionGroup, emptyProps, props} from '@ngrx/store';
import {StationAsset} from '../../../shared/models/station-assets';
import {errorProps} from '../../utils/error-props.util';

export const assetActions = createActionGroup({
  source: 'Asset',
  events: {
    'Load assets for station': props<{stationId: string; collection: string}>(),
    'Set loaded assets': props<{assets: StationAsset[] | undefined}>(),
    'Set asset loading error': errorProps(),
    'Reset state': emptyProps(),
  },
});
