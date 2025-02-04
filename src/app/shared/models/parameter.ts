import {type TranslatableString} from './translatable-string';

export interface Parameter {
  id: string;
  description: TranslatableString;
  group: TranslatableString;
}

export interface ParameterGroup {
  name: TranslatableString;
  parameters: Parameter[];
}
