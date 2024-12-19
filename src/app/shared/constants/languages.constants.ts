import {LanguageIdentifier} from '../types/languages.types';

export const supportedLanguages = ['de', 'fr', 'it', 'en'] as const;
export const defaultLanguage = 'de' satisfies LanguageIdentifier;
