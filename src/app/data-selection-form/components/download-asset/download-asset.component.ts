import {AsyncPipe} from '@angular/common';
import {Component, inject} from '@angular/core';
import {TranslocoModule} from '@jsverse/transloco';
import {Store} from '@ngrx/store';
import {selectSelectedAsset} from '../../../state/assets/selectors/asset.selectors';
import {selectSelectedCollectionMetaAssets} from '../../../state/form/selectors/form.selector';

@Component({
  selector: 'app-download-asset',
  imports: [TranslocoModule, AsyncPipe],
  templateUrl: './download-asset.component.html',
  styleUrl: './download-asset.component.scss',
})
export class DownloadAssetComponent {
  private readonly store = inject(Store);

  protected readonly selectedAsset$ = this.store.select(selectSelectedAsset);
  protected readonly selectedMetaAsset$ = this.store.select(selectSelectedCollectionMetaAssets);
}
