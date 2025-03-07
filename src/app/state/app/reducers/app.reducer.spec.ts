import {AppUrlParameter} from '../../../shared/models/app-url-parameter';
import {appActions} from '../actions/app.actions';
import {AppState} from '../states/app.state';
import {appFeature} from './app.reducer';

describe('App Reducer', () => {
  let state: AppState;

  beforeEach(() => {
    state = {
      language: 'en',
      isInitialized: false,
    };
  });

  it('should set the given language', () => {
    const action = appActions.setLanguage({language: 'de'});

    const result = appFeature.reducer(state, action);

    expect(result).toEqual({
      ...state,
      language: 'de',
    });
  });

  it('should initialize the app', () => {
    const action = appActions.initializeApp({parameter: {} as AppUrlParameter});

    const result = appFeature.reducer(state, action);

    expect(result).toEqual({
      ...state,
      isInitialized: true,
    });
  });
});
