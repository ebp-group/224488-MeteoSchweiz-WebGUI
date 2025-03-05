import {AsyncPipe} from '@angular/common';
import {Component, inject, input, output} from '@angular/core';
import {Store} from '@ngrx/store';
import {ParameterGroup} from '../../../shared/models/parameter';
import {appFeature} from '../../../state/app/reducers/app.reducer';

@Component({
  selector: 'app-parameter-selection',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './parameter-selection.component.html',
  styleUrl: './parameter-selection.component.scss',
})
export class ParameterSelectionComponent {
  private readonly store = inject(Store);

  public readonly parameterGroup = input.required<ParameterGroup>();
  public readonly isSelected = input(false);
  public readonly selected = output<string | null>();
  protected readonly currentLanguage$ = this.store.select(appFeature.selectLanguage);

  protected setParameterGroupSelected(): void {
    const parameterGroupId = this.isSelected() ? null : this.parameterGroup().id;
    this.selected.emit(parameterGroupId);
  }
}
