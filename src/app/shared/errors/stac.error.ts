import {marker} from '@jsverse/transloco-keys-manager/marker';
import {FatalError} from './base.error';

export class StacLoadError extends FatalError {
  public override message = marker('stac.load.error');
  public override translationArguments: Record<'collectionId' | 'stationId', string>;

  constructor(collectionId: string, stationId?: string, originalError?: unknown) {
    super(originalError);
    this.translationArguments = {
      collectionId: collectionId,
      stationId: stationId ?? '<null>',
    };
  }
}
