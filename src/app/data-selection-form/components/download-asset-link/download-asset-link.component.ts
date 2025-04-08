import {Component, input} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {CollectionAsset} from '../../../shared/models/collection-assets';
import {StationAsset} from '../../../shared/models/station-assets';

@Component({
  selector: 'app-download-asset-link',
  imports: [MatIcon],
  templateUrl: './download-asset-link.component.html',
  styleUrl: './download-asset-link.component.scss',
})
export class DownloadAssetLinkComponent {
  public readonly asset = input.required<StationAsset | CollectionAsset>();
}
