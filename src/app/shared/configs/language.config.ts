import type {LanguageConfig} from '../models/configs/language-config';

export const languageConfig = {
  defaultLanguage: 'de',
} as const satisfies LanguageConfig;
