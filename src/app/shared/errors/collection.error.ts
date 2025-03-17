import {marker} from '@jsverse/transloco-keys-manager/marker';
import {FatalError} from './base.error';

export class CollectionError extends FatalError {
  public override message = marker('collection.load.error');
}
