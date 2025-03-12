import {languages} from '../models/language';
import {isLanguage} from './language-guard';

describe('isLanguage', () => {
  languages.forEach((language) => {
    it(`returns true for '${language}'`, () => {
      expect(isLanguage(`${language}`)).toBe(true);
    });
  });

  it('returns false for a misspelled language string', () => {
    expect(isLanguage('dee')).toBe(false);
  });

  it('returns false for an uppercase language string', () => {
    expect(isLanguage('DE')).toBe(false);
  });

  it('returns false for an invalid language', () => {
    expect(isLanguage('es')).toBe(false);
  });

  it('returns false for an empty string', () => {
    expect(isLanguage('')).toBe(false);
  });
});
