import {AsyncPipe} from '@angular/common';
import {Component, inject} from '@angular/core';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {MatStepperModule} from '@angular/material/stepper';
import {TranslocoModule} from '@jsverse/transloco';
import {marker} from '@jsverse/transloco-keys-manager/marker';
import {Store} from '@ngrx/store';
import {MeasurementDataType, measurementDataTypes} from '../../../shared/models/measurement-data-type';
import {formActions} from '../../../state/form/actions/form.actions';
import {formFeature} from '../../../state/form/reducers/form.reducer';

@Component({
  selector: 'app-measurement-data-type-selection',
  imports: [TranslocoModule, MatButtonToggleGroup, MatButtonToggle, MatStepperModule, AsyncPipe],
  templateUrl: './measurement-data-type-selection.component.html',
  styleUrl: './measurement-data-type-selection.component.scss',
})
export class MeasurementDataTypeSelectionComponent {
  private readonly store = inject(Store);

  private readonly measurementDataTypeLabelMapping: Record<MeasurementDataType, string> = {
    normal: marker('form.measurement-data-type.normal'),
    homogenous: marker('form.measurement-data-type.homogenous'),
  };
  protected readonly allMeasurementDataTypes = measurementDataTypes.map((dataType) => ({
    dataType,
    label: this.measurementDataTypeLabelMapping[dataType],
  }));

  protected readonly selectedMeasurementDataType$ = this.store.select(formFeature.selectSelectedMeasurementDataType);

  protected setSelectedMeasurementDataType(measurementDataType: MeasurementDataType): void {
    this.store.dispatch(formActions.setSelectedMeasurementDataType({measurementDataType}));
  }
}
