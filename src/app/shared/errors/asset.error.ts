import {marker} from '@jsverse/transloco-keys-manager/marker';
import {SilentError} from './base.error';

export class AssetLoadError extends SilentError {
  public override message = marker('asset.load.error');
}

export class AssetParseError extends SilentError {
  public override message = marker('asset.parse.error');
  public override translationArguments: Record<'filename', string>;

  constructor(filename?: string, originalError?: unknown) {
    super(originalError);

    this.translationArguments = filename ? {filename} : {filename: 'Unknown file'};
  }
}
