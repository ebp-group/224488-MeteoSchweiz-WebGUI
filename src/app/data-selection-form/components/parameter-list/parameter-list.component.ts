import {AsyncPipe} from '@angular/common';
import {Component, inject} from '@angular/core';
import {TranslocoService} from '@jsverse/transloco';
import {Store} from '@ngrx/store';
import {combineLatest, map} from 'rxjs';
import {ParameterGroup} from '../../../shared/models/parameter';
import {formActions} from '../../../state/form/actions/form.actions';
import {formFeature} from '../../../state/form/reducers/form.reducer';
import {selectParameterGroups} from '../../../state/parameters/selector/parameter.selector';
import {ParameterSelectionComponent} from '../parameter-selection/parameter-selection.component';
import type {Language} from '../../../shared/models/language';

@Component({
  selector: 'app-parameter-list',
  standalone: true,
  imports: [ParameterSelectionComponent, AsyncPipe],
  templateUrl: './parameter-list.component.html',
  styleUrl: './parameter-list.component.scss',
})
export class ParameterListComponent {
  private readonly store = inject(Store);
  private readonly translocoService = inject(TranslocoService);

  protected readonly parameterGroups$ = combineLatest([this.store.select(selectParameterGroups), this.translocoService.langChanges$]).pipe(
    map(([groups, language]): ParameterGroup[] =>
      [...groups].sort((a, b) => a.name[language as Language].localeCompare(b.name[language as Language])),
    ),
  );
  protected readonly selectedParameterGroup$ = this.store.select(formFeature.selectSelectedParameterGroupId);

  protected setSelectedParameterGroup(parameterGroupId: string | null): void {
    this.store.dispatch(formActions.setSelectedParameters({parameterGroupId}));
  }
}
