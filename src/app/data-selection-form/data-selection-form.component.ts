import {AsyncPipe} from '@angular/common';
import {Component, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {MatStepperModule} from '@angular/material/stepper';
import {TranslocoModule} from '@jsverse/transloco';
import {Store} from '@ngrx/store';
import {MapContainerComponent} from '../map/components/map-container/map-container.component';
import {MeasurementDataType} from '../shared/models/measurement-data-type';
import {appActions} from '../state/app/actions/app.actions';
import {formActions} from '../state/form/actions/form.actions';
import {formFeature} from '../state/form/reducers/form.reducer';
import {CollectionSelectionComponent} from './components/collection-selection/collection-selection.component';
import {DownloadAssetComponent} from './components/download-asset/download-asset.component';
import {IntervalSelectionComponent} from './components/interval-selection/interval-selection.component';
import {ParameterGroupSelectionComponent} from './components/parameter-group-selection/parameter-group-selection.component';
import {SelectionReviewComponent} from './components/selection-review/selection-review.component';
import {StationSelectionComponent} from './components/station-selection/station-selection.component';
import {TimeRangeSelectionComponent} from './components/time-range-selection/time-range-selection.component';
import type {Language} from '../shared/models/language';

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
    MapContainerComponent,
    StationSelectionComponent,
    CollectionSelectionComponent,
    ParameterGroupSelectionComponent,
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

  protected changeLanguage(language: Language): void {
    this.store.dispatch(appActions.setLanguage({language}));
  }

  protected testError(): void {
    throw new Error('Test');
  }

  protected setSelectedMeasurementDataType(measurementDataType: MeasurementDataType): void {
    this.store.dispatch(formActions.setSelectedMeasurementDataType({measurementDataType}));
  }
}
