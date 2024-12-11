import {TranslocoGlobalConfig} from '@jsverse/transloco-utils';

const config: TranslocoGlobalConfig = {
  rootTranslationsPath: 'src/assets/i18n/',
  langs: ['de', 'fr', 'it', 'en'],
  keysManager: {
    output: 'public/i18n',
  },
};

export default config;
