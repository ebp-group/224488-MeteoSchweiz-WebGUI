import {emptyIcon, iconsConfig} from '../configs/icons.config';
import {IconFromConfigPipe} from './icon-from-config.pipe';

describe('IconFromConfigPipe', () => {
  let pipe: IconFromConfigPipe;

  beforeEach(() => {
    pipe = new IconFromConfigPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('returns icon id when value matches an icon id', () => {
    const iconId = iconsConfig[0].id;
    expect(pipe.transform(iconId)).toBe(iconId);
  });

  it('returns icon id when value matches an icon id ignoring case', () => {
    const iconId = iconsConfig[0].id;
    const upperCaseIconId = iconId.toUpperCase();
    expect(pipe.transform(upperCaseIconId)).toBe(iconId);
  });

  it('returns the empty icon when value does not match any icon id', () => {
    expect(pipe.transform('non-existent-id')).toBe(emptyIcon.id);
  });

  it('returns the empty icon when value is undefined', () => {
    expect(pipe.transform(undefined)).toBe(emptyIcon.id);
  });
});
