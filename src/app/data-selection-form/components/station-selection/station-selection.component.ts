import {AsyncPipe} from '@angular/common';
import {Component, inject} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {MatFormField} from '@angular/material/form-field';
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
  imports: [MatFormField, ReactiveFormsModule, MatAutocompleteTrigger, MatAutocomplete, MatOption, AsyncPipe, MatInput, TranslocoDirective],
  templateUrl: './station-selection.component.html',
  styleUrl: './station-selection.component.scss',
})
export class StationSelectionComponent extends AutocompleteSelectionComponent<Station> {
  private readonly store = inject(Store);

  protected override selectedValue$ = this.store.select(formFeature.selectSelectedStationId);
  protected override allValueObjects$ = this.store.select(selectUniqueStationsFilteredBySelectedParameterGroups);

  protected override filterObjects(valueObjects: Station[], filterValue: string, _: string | null): Station[] {
    const lowerCaseValue = filterValue.toLowerCase();
    return valueObjects.filter((station) => station.displayName.toLowerCase().includes(lowerCaseValue));
  }

  protected override dispatchValueChange(valueId: string | null): void {
    this.store.dispatch(formActions.setSelectedStationId({stationId: valueId}));
  }
}
