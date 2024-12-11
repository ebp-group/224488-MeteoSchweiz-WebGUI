import {type Language} from '../types/language.types';

export const supportedLanguages = ['de', 'fr', 'it', 'en'] as const;
export const defaultLanguage = 'de' satisfies Language;
