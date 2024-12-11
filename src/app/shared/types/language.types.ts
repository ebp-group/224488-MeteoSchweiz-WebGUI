import {supportedLanguages} from '../constants/language.constants';

export type Language = (typeof supportedLanguages)[number];
