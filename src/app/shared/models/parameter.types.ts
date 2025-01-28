import {TranslatableString} from '../types/translatable-string.types';

export interface Parameter {
  id: string;
  description: TranslatableString;
  group: TranslatableString;
}

export interface ParameterGroup {
  name: TranslatableString;
  parameters: Parameter[];
}
