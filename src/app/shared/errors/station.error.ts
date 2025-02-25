import {marker} from '@jsverse/transloco-keys-manager/marker';
import {FatalError} from './base.error';

export class StationError extends FatalError {
  public override message = marker('station.load.error');
}
