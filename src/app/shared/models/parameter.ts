import {DisplayItem} from './display-item';
import type {TranslatableString} from './translatable-string';

export interface Parameter {
  id: string;
  group: TranslatableString;
}

export interface ParameterGroup {
  id: string;
  name: TranslatableString;
}

export type LocalizedParameterGroup = ParameterGroup & DisplayItem;
