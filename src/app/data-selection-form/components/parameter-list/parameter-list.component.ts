import {AsyncPipe} from '@angular/common';
import {Component, inject} from '@angular/core';
import {Store} from '@ngrx/store';
import {formActions} from '../../../state/form/actions/form.actions';
import {formFeature} from '../../../state/form/reducers/form.reducer';
import {selectParameterGroupsSortedByLocalizedName} from '../../../state/parameters/selectors/parameter.selector';
import {ParameterSelectionComponent} from '../parameter-selection/parameter-selection.component';

@Component({
  selector: 'app-parameter-list',
  imports: [ParameterSelectionComponent, AsyncPipe],
  templateUrl: './parameter-list.component.html',
  styleUrl: './parameter-list.component.scss',
})
export class ParameterListComponent {
  private readonly store = inject(Store);

  protected readonly parameterGroups$ = this.store.select(selectParameterGroupsSortedByLocalizedName);
  protected readonly selectedParameterGroup$ = this.store.select(formFeature.selectSelectedParameterGroupId);

  protected setSelectedParameterGroup(parameterGroupId: string | null): void {
    this.store.dispatch(formActions.setSelectedParameters({parameterGroupId}));
  }
}
