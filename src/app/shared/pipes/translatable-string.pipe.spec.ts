import {TranslatableStringPipe} from './translatable-string.pipe';

describe('TranslatableStringPipe', () => {
  let pipe: TranslatableStringPipe;

  beforeEach(() => {
    pipe = new TranslatableStringPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the value if the value is not of type TranslatableString', () => {
    const actual = pipe.transform('test', 'de');
    expect(actual).toBe('test');
  });

  it('should return the value in the correct language if it is of type TranslatableString', () => {
    const actual = pipe.transform({de: 'de-test', it: 'it-test', en: 'en-test', fr: 'fr-test'}, 'it');
    expect(actual).toBe('it-test');
  });
});
