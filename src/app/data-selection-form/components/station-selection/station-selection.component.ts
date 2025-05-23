import {AsyncPipe} from '@angular/common';
import {Component, inject} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {MatIconButton} from '@angular/material/button';
import {MatFormField, MatSuffix} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {TranslocoDirective} from '@jsverse/transloco';
import {Store} from '@ngrx/store';
import {Station} from '../../../shared/models/station';
import {formActions} from '../../../state/form/actions/form.actions';
import {formFeature} from '../../../state/form/reducers/form.reducer';
import {selectUniqueStationsFilteredBySelectedParameterGroups} from '../../../state/stations/selectors/station.selector';
import {AutocompleteSelectionComponent} from '../autocomplete-selection/autocomplete-selection.component';

@Component({
  selector: 'app-station-selection',
  imports: [
    MatFormField,
    ReactiveFormsModule,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
    AsyncPipe,
    MatInput,
    TranslocoDirective,
    MatIcon,
    MatSuffix,
    MatIconButton,
  ],
  templateUrl: './station-selection.component.html',
  styleUrl: './station-selection.component.scss',
})
export class StationSelectionComponent extends AutocompleteSelectionComponent<Station> {
  private readonly store = inject(Store);

  protected override selectedId$ = this.store.select(formFeature.selectSelectedStationId);
  protected override allDisplayItems$ = this.store.select(selectUniqueStationsFilteredBySelectedParameterGroups);

  protected override filterDisplayItems(allStations: Station[], filterValue: string, _: string | null): Station[] {
    const lowerCaseValue = filterValue.toLowerCase();
    return allStations.filter((station) => station.displayName.toLowerCase().includes(lowerCaseValue));
  }

  protected override dispatchValueChange(id: string | null): void {
    this.store.dispatch(formActions.setSelectedStationId({stationId: id}));
  }
}
