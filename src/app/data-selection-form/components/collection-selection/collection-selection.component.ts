import {AsyncPipe} from '@angular/common';
import {Component, inject} from '@angular/core';
import {Store} from '@ngrx/store';
import {formActions} from '../../../state/form/actions/form.actions';
import {formFeature} from '../../../state/form/reducers/form.reducer';
import {selectCollectionsForSelectedStation} from '../../../state/form/selectors/form.selector';

@Component({
  selector: 'app-collection-selection',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './collection-selection.component.html',
  styleUrl: './collection-selection.component.scss',
})
export class CollectionSelectionComponent {
  private readonly store = inject(Store);

  protected selectedStationCollections$ = this.store.select(selectCollectionsForSelectedStation);
  protected selectedCollection$ = this.store.select(formFeature.selectSelectedCollection);

  protected setSelectedCollection(collection: string): void {
    this.store.dispatch(formActions.setSelectedCollection({collection}));
  }
}
