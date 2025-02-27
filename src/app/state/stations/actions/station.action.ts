import {createActionGroup, props} from '@ngrx/store';
import {MeasurementDataType} from '../../../shared/models/measurement-data-type';
import {Station} from '../../../shared/models/station';

export const stationActions = createActionGroup({
  source: 'Stations',
  events: {
    'Set loaded stations': props<{stations: Station[]; measurementDataType: MeasurementDataType}>(),
    'Load stations for collections': props<{collections: string[]; measurementDataType: MeasurementDataType}>(),
    'Set station loading error': props<{error?: unknown; measurementDataType: MeasurementDataType}>(),
  },
});
