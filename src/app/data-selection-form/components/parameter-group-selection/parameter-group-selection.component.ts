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
import {LocalizedParameterGroup} from '../../../shared/models/parameter';
import {IconFromConfigPipe} from '../../../shared/pipes/icon-from-config.pipe';
import {formActions} from '../../../state/form/actions/form.actions';
import {formFeature} from '../../../state/form/reducers/form.reducer';
import {selectLocalizedAndSortedParameterGroups} from '../../../state/parameters/selectors/parameter.selector';
import {AutocompleteSelectionComponent} from '../autocomplete-selection/autocomplete-selection.component';

@Component({
  selector: 'app-parameter-group-selection',
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
    IconFromConfigPipe,
    MatSuffix,
    MatIconButton,
  ],
  templateUrl: './parameter-group-selection.component.html',
  styleUrl: './parameter-group-selection.component.scss',
})
export class ParameterGroupSelectionComponent extends AutocompleteSelectionComponent<LocalizedParameterGroup> {
  private readonly store = inject(Store);

  protected override selectedValue$ = this.store.select(formFeature.selectSelectedParameterGroupId);
  protected override allValueObjects$ = this.store.select(selectLocalizedAndSortedParameterGroups);

  protected override filterObjects(
    valueObjects: LocalizedParameterGroup[],
    filterValue: string,
    selectedValue: string | null,
  ): LocalizedParameterGroup[] {
    const selectedValueObject = this.findObject(selectedValue, valueObjects);
    if (selectedValueObject && selectedValueObject.displayName === filterValue) {
      return valueObjects;
    }

    const lowerCaseValue = filterValue.toLowerCase();
    return valueObjects.filter((parameterGroup) => parameterGroup.displayName.toLowerCase().includes(lowerCaseValue));
  }

  protected override dispatchValueChange(valueId: string | null): void {
    this.store.dispatch(formActions.setSelectedParameters({parameterGroupId: valueId}));
  }
}
