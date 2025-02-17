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

  public parameterGroup = input.required<ParameterGroup>();
  public isSelected = input(false);
  public selected = output<string | null>();

  protected setParameterGroupSelected() {
    const parameterGroupId = this.isSelected() ? null : this.parameterGroup().id;
    this.selected.emit(parameterGroupId);
  }
}
