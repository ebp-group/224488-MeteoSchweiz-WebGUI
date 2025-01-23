import {Component, inject} from '@angular/core';
import {TranslocoModule} from '@jsverse/transloco';
import {Store} from '@ngrx/store';
import {AsyncPipe} from '@angular/common';
import {formFeature} from '../../state/form/reducers/form.reducer';

@Component({
  selector: 'app-asset-list',
  standalone: true,
  imports: [TranslocoModule, AsyncPipe],
  templateUrl: './asset-list.component.html',
  styleUrl: './asset-list.component.scss',
})
export class AssetListComponent {
  private readonly store = inject(Store);

  public readonly assets$ = this.store.select(formFeature.selectAssetsFromSelectedStation);
}
