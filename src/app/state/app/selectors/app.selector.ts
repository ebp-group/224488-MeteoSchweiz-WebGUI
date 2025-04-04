import {createSelector} from '@ngrx/store';
import {AppUrlParameter} from '../../../shared/models/app-url-parameter';
import {formFeature} from '../../form/reducers/form.reducer';
import {appFeature} from '../reducers/app.reducer';

export const selectCurrentAppUrlParameter = createSelector(
  appFeature.selectLanguage,
  formFeature.selectFormState,
  (language, formState): AppUrlParameter => ({
    language,
    measurementDataType: formState.selectedMeasurementDataType,
    parameterGroupId: formState.selectedParameterGroupId,
    stationId: formState.selectedStationId,
    collection: formState.selectedCollection,
    dataInterval: formState.selectedDataInterval,
    timeRange: formState.selectedTimeRange,
    historicalDateRange: formState.selectedHistoricalDateRange,
  }),
);
