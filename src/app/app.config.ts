import {provideHttpClient} from '@angular/common/http';
import {ApplicationConfig, ErrorHandler, isDevMode, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideTransloco} from '@jsverse/transloco';
import {provideEffects} from '@ngrx/effects';
import {provideStore} from '@ngrx/store';
import {provideStoreDevtools} from '@ngrx/store-devtools';
import {routes} from './app.routes';
import {ErrorHandlerService} from './error-handling/error-handler.service';
import {languageConfig} from './shared/configs/language.config';
import {languages} from './shared/models/language';
import {effects, metaReducers, reducers} from './state';
import {TranslocoHttpLoader} from './transloco-loader';

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
        availableLangs: [...languages],
        defaultLang: languageConfig.defaultLanguage,
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
  ],
};
