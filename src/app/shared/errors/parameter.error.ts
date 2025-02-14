import {FatalError} from './base.error';

export class ParameterError extends FatalError {
  public override message = 'parameter.load.error';
}
