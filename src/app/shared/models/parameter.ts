import {LocalizedDisplayItem} from './localized-display-item';
import type {TranslatableString} from './translatable-string';

export interface Parameter {
  id: string;
  group: TranslatableString;
}

export interface ParameterGroup {
  id: string;
  name: TranslatableString;
}

export interface LocalizedParameterGroup extends ParameterGroup, LocalizedDisplayItem {
  displayName: string;
}
