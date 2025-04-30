import {ClipboardModule} from '@angular/cdk/clipboard';
import {AsyncPipe} from '@angular/common';
import {Component, inject} from '@angular/core';
import {MatMiniFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatFormField, MatInput} from '@angular/material/input';
import {MatTooltip} from '@angular/material/tooltip';
import {TranslocoModule} from '@jsverse/transloco';
import {Store} from '@ngrx/store';
import {ExternalLinkComponent} from '../../../shared/components/external-link/external-link.component';
import {selectSelectedAsset} from '../../../state/assets/selectors/asset.selectors';
import {selectSelectedCollectionMetaAssets} from '../../../state/form/selectors/form.selector';
import {DownloadAssetLinkComponent} from '../download-asset-link/download-asset-link.component';

@Component({
  selector: 'app-download-asset',
  imports: [
    TranslocoModule,
    AsyncPipe,
    DownloadAssetLinkComponent,
    MatInput,
    MatFormField,
    MatIcon,
    MatMiniFabButton,
    ClipboardModule,
    MatTooltip,
    ExternalLinkComponent,
  ],
  templateUrl: './download-asset.component.html',
  styleUrl: './download-asset.component.scss',
})
export class DownloadAssetComponent {
  private readonly store = inject(Store);

  protected readonly selectedAsset$ = this.store.select(selectSelectedAsset);
  protected readonly selectedMetaAsset$ = this.store.select(selectSelectedCollectionMetaAssets);
}
