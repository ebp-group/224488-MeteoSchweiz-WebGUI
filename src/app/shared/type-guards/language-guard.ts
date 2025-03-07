import {Language, languages} from '../models/language';

export function isLanguage(value: string): value is Language {
  return languages.includes(value as Language);
}
