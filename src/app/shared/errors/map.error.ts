import {marker} from '@jsverse/transloco-keys-manager/marker';
import {FatalError, SilentError} from './base.error';

export class MapError extends FatalError {
  public override message = marker('map.load.error');
}

export class MapNotInitializedError extends SilentError {
  public override message = marker('map.not.initialized.error');
}
