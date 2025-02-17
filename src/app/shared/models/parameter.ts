import type {TranslatableString} from './translatable-string';

export interface Parameter {
  id: string;
  description: TranslatableString;
  group: TranslatableString;
}

export interface ParameterGroup {
  id: string;
  name: TranslatableString;
}
