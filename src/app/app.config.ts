import {ApplicationConfig, ErrorHandler, provideZoneChangeDetection, isDevMode} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideStore} from '@ngrx/store';
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
