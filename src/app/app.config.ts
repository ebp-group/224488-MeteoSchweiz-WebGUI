import {ApplicationConfig, ErrorHandler, provideZoneChangeDetection, isDevMode} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideStore} from '@ngrx/store';
import {provideStoreDevtools} from '@ngrx/store-devtools';
import {provideEffects} from '@ngrx/effects';
import {effects, metaReducers, reducers} from './state';
import {ErrorHandlerService} from './error-handling/error-handler.service';
import {provideHttpClient} from '@angular/common/http';
import {TranslocoHttpLoader} from './transloco-loader';
import {provideTransloco} from '@jsverse/transloco';
import {supportedLanguages, defaultLanguage} from './shared/constants/language.constants';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideStore(reducers, {metaReducers}),
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
      connectInZone: true, // If set to true, the connection is established within the Angular zone
    }),
    provideEffects(effects),
    {provide: ErrorHandler, useClass: ErrorHandlerService},
    provideHttpClient(),
    provideTransloco({
      config: {
        availableLangs: [...supportedLanguages],
        defaultLang: defaultLanguage,
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
  ],
};
