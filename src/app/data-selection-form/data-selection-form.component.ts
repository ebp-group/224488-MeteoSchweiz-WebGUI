import {AsyncPipe} from '@angular/common';
import {Component, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {MatStepperModule} from '@angular/material/stepper';
import {TranslocoModule} from '@jsverse/transloco';
import {Store} from '@ngrx/store';
import {MeasurementDataType} from '../shared/models/measurement-data-type';
import {formActions} from '../state/form/actions/form.actions';
import {formFeature} from '../state/form/reducers/form.reducer';
import {DownloadAssetComponent} from './components/download-asset/download-asset.component';
import {IntervalSelectionComponent} from './components/interval-selection/interval-selection.component';
import {SelectionReviewComponent} from './components/selection-review/selection-review.component';
import {StationSelectionStepComponent} from './components/station-selection-step/station-selection-step.component';
import {TimeRangeSelectionComponent} from './components/time-range-selection/time-range-selection.component';

@Component({
  selector: 'app-data-selection-form',
  imports: [
    TranslocoModule,
    MatButton,
    MatButtonToggleGroup,
    MatButtonToggle,
    IntervalSelectionComponent,
    TimeRangeSelectionComponent,
    SelectionReviewComponent,
    DownloadAssetComponent,
    MatStepperModule,
    AsyncPipe,
    StationSelectionStepComponent,
  ],
  templateUrl: './data-selection-form.component.html',
  styleUrl: './data-selection-form.component.scss',
})
export class DataSelectionFormComponent {
  private readonly store = inject(Store);

  protected readonly selectedSelectedDataInterval$ = this.store.select(formFeature.selectSelectedDataInterval);
  protected readonly selectedSelectedTimeRange$ = this.store.select(formFeature.selectSelectedTimeRange);
  protected readonly selectedMeasurementDataType$ = this.store.select(formFeature.selectSelectedMeasurementDataType);
  protected readonly selectedCollection$ = this.store.select(formFeature.selectSelectedCollection);

  protected setSelectedMeasurementDataType(measurementDataType: MeasurementDataType): void {
    this.store.dispatch(formActions.setSelectedMeasurementDataType({measurementDataType}));
  }
}
