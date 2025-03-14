import {createSelector} from '@ngrx/store';
import {assetFeature} from '../reducers/asset.reducer';
import type {DataInterval} from '../../../shared/models/interval';

export const selectAvailableDataInterval = createSelector(assetFeature.selectAssets, (assets): DataInterval[] => {
  return [...new Set(assets?.map((asset) => asset.interval))];
});
