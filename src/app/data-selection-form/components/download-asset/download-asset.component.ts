import {Component} from '@angular/core';
import {TranslocoModule} from '@jsverse/transloco';

@Component({
  selector: 'app-download-asset',
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './download-asset.component.html',
  styleUrl: './download-asset.component.scss',
})
export class DownloadAssetComponent {}
