import {AsyncPipe} from '@angular/common';
import {Component, inject} from '@angular/core';
import {TranslocoModule} from '@jsverse/transloco';
import {Store} from '@ngrx/store';
import {TranslatableStringPipe} from '../../../shared/pipes/translatable-string.pipe';
import {appFeature} from '../../../state/app/reducers/app.reducer';
import {formActions} from '../../../state/form/actions/form.actions';
import {formFeature} from '../../../state/form/reducers/form.reducer';
import {selectSelectedStationWithParameterGroupsFilteredBySelectedParameterGroup} from '../../../state/form/selectors/form.selector';

@Component({
  selector: 'app-collection-selection',
  imports: [AsyncPipe, TranslatableStringPipe, TranslocoModule],
  templateUrl: './collection-selection.component.html',
  styleUrl: './collection-selection.component.scss',
})
export class CollectionSelectionComponent {
  private readonly store = inject(Store);

  protected readonly stationParameterGroups$ = this.store.select(selectSelectedStationWithParameterGroupsFilteredBySelectedParameterGroup);
  protected readonly selectedCollection$ = this.store.select(formFeature.selectSelectedCollection);
  protected readonly currentLanguage$ = this.store.select(appFeature.selectLanguage);

  protected setSelectedCollection(collection: string): void {
    this.store.dispatch(formActions.setSelectedCollection({collection}));
  }
}
