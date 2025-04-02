import {AsyncPipe} from '@angular/common';
import {Component, inject} from '@angular/core';
import {MatRadioButton} from '@angular/material/radio';
import {TranslocoModule} from '@jsverse/transloco';
import {Store} from '@ngrx/store';
import {TranslatableStringPipe} from '../../../shared/pipes/translatable-string.pipe';
import {appFeature} from '../../../state/app/reducers/app.reducer';
import {formActions} from '../../../state/form/actions/form.actions';
import {formFeature} from '../../../state/form/reducers/form.reducer';
import {selectSelectedStationsFilteredBySelectedParameterGroup} from '../../../state/form/selectors/form.selector';
import {StationInfoComponent} from '../station-info/station-info.component';

@Component({
  selector: 'app-collection-selection',
  imports: [AsyncPipe, TranslatableStringPipe, TranslocoModule, MatRadioButton, StationInfoComponent, StationInfoComponent],
  templateUrl: './collection-selection.component.html',
  styleUrl: './collection-selection.component.scss',
})
export class CollectionSelectionComponent {
  private readonly store = inject(Store);

  protected readonly stationParameterGroups$ = this.store.select(selectSelectedStationsFilteredBySelectedParameterGroup);
  protected readonly selectedCollection$ = this.store.select(formFeature.selectSelectedCollection);
  protected readonly currentLanguage$ = this.store.select(appFeature.selectLanguage);

  protected setSelectedCollection(collection: string): void {
    this.store.dispatch(formActions.setSelectedCollection({collection}));
  }
}
