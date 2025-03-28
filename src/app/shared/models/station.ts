import {LocalizedDisplayItem} from './localized-display-item';
import type {Coordinates} from './coordinates';
import type {TranslatableString} from './translatable-string';

export interface Station extends LocalizedDisplayItem {
  id: string;
  name: string;
  displayName: string;
  coordinates: Coordinates;
  collection: string;
  type: TranslatableString;
}
