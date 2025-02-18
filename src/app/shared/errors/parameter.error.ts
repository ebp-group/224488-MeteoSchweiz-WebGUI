import {marker} from '@jsverse/transloco-keys-manager/marker';
import {FatalError} from './base.error';

export class ParameterError extends FatalError {
  public override message = marker('parameter.load.error');
}
