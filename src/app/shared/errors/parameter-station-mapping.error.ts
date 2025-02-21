import {marker} from '@jsverse/transloco-keys-manager/marker';
import {FatalError} from './base.error';

export class ParameterStationMappingError extends FatalError {
  public override message = marker('parameter-station-mapping.load.error');
}
