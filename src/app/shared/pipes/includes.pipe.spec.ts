import {IncludesPipe} from './includes.pipe';

describe('IncludesPipe', () => {
  let pipe: IncludesPipe;

  beforeEach(() => {
    pipe = new IncludesPipe();
  });

  const testValues: [Parameters<(typeof pipe)['transform']>[0], Parameters<(typeof pipe)['transform']>[1], boolean][] = [
    [undefined, 'a', false],
    [null, '1', false],
    [[], 1, false],
    ['', '', true],
    [[1, 2, 3], 1, true],
    [[1, 2, 3], 13, false],
    [['1', '2'], '1', true],
    [['1', '2'], '12', false],
    ['1124', '1', true],
    ['1124', '', true],
    ['', 'e', false],
    ['1124', '14', false],
    [{includes: (): boolean => true}, 'lol', true],
  ];
  testValues.forEach(([target, value, expected]) => {
    it(`should return '${expected}' if '${JSON.stringify(value)}' is searched in '${target}'`, () => {
      const actual = pipe.transform(target, value);
      expect(actual).toBe(expected);
    });
  });

  it('should return true if a map has the key', () => {
    const actual = pipe.transform(new Map([['a', 1]]), 'a');
    expect(actual).toBe(true);
  });

  it('should return false if a map does not have the key', () => {
    const actual = pipe.transform(new Map([['a', 1]]), '1');
    expect(actual).toBe(false);
  });

  it('should return true if a set has the key', () => {
    const actual = pipe.transform(new Set(['a', 1]), 'a');
    expect(actual).toBe(true);
  });

  it('should return false if a set does not have the key', () => {
    const actual = pipe.transform(new Set(['a', 1]), 55);
    expect(actual).toBe(false);
  });
});
