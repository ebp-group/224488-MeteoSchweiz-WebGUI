import {Component, inject} from '@angular/core';
import {TranslocoModule} from '@jsverse/transloco';
import {Store} from '@ngrx/store';
import {AsyncPipe} from '@angular/common';
import {selectFilteredStationAssets} from '../../state/form/selector/form.selector';

@Component({
  selector: 'app-asset-list',
  standalone: true,
  imports: [TranslocoModule, AsyncPipe],
  templateUrl: './asset-list.component.html',
  styleUrl: './asset-list.component.scss',
})
export class AssetListComponent {
  private readonly store = inject(Store);

  public readonly assets$ = this.store.select(selectFilteredStationAssets);
}
