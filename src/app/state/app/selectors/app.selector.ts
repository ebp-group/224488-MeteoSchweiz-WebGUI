import {createSelector} from '@ngrx/store';
import {AppUrlParameter} from '../../../shared/models/app-url-parameter';
import {formFeature} from '../../form/reducers/form.reducer';
import {appFeature} from '../reducers/app.reducer';

export const selectCurrentAppUrlParameter = createSelector(
  appFeature.selectLanguage,
  formFeature.selectSelectedMeasurementDataType,
  formFeature.selectSelectedParameterGroupId,
  formFeature.selectSelectedStationId,
  (language, measurementDataType, parameterGroupId, stationId): AppUrlParameter => ({
    language,
    measurementDataType,
    parameterGroupId,
    stationId,
  }),
);
