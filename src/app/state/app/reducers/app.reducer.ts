import {createFeature, createReducer, on} from '@ngrx/store';
import {languageConfig} from '../../../shared/configs/language.config';
import {appActions} from '../actions/app.actions';
import {AppState} from '../states/app.state';

export const appFeatureKey = 'app';

export const initialState: AppState = {
  isInitialized: false,
  language: languageConfig.defaultLanguage,
};

export const appFeature = createFeature({
  name: appFeatureKey,
  reducer: createReducer(
    initialState,
    on(
      appActions.setLanguage,
      (state, {language}): AppState => ({
        ...state,
        language,
      }),
    ),
    on(
      appActions.initializeApp,
      (state): AppState => ({
        ...state,
        isInitialized: true,
      }),
    ),
  ),
});
