import {Component, inject, input, output} from '@angular/core';
import {ParameterGroup} from '../../../shared/models/parameter';
import {TranslatableStringService} from '../../../shared/services/translation.service';

@Component({
  selector: 'app-parameter-selection',
  standalone: true,
  imports: [],
  templateUrl: './parameter-selection.component.html',
  styleUrl: './parameter-selection.component.scss',
})
export class ParameterSelectionComponent {
  protected translationService = inject(TranslatableStringService);

  public readonly parameterGroup = input.required<ParameterGroup>();
  public readonly isSelected = input(false);
  public readonly selected = output<string | null>();

  protected setParameterGroupSelected(): void {
    const parameterGroupId = this.isSelected() ? null : this.parameterGroup().id;
    this.selected.emit(parameterGroupId);
  }
}
