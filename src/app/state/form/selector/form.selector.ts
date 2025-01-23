import {createSelector} from '@ngrx/store';
import {formFeature} from '../reducers/form.reducer';

export const selectFilteredStationAssets = createSelector(
  formFeature.selectAssetsFromSelectedStation,
  formFeature.selectIntervalSelection,
  (assets, intervalSelection) => {
    return assets.filter((asset) => intervalSelection == null || asset.interval === intervalSelection);
  },
);
