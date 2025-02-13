import {provideHttpClient} from '@angular/common/http';
import {ApplicationConfig, ErrorHandler, isDevMode, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideTransloco} from '@jsverse/transloco';
import {provideEffects} from '@ngrx/effects';
import {provideStore} from '@ngrx/store';
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
