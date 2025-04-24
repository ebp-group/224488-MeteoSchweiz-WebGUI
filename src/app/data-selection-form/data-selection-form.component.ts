import {AsyncPipe} from '@angular/common';
import {AfterViewInit, Component, inject, OnDestroy, ViewChild} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatStepper, MatStepperModule} from '@angular/material/stepper';
import {MatTooltip} from '@angular/material/tooltip';
import {TranslocoModule} from '@jsverse/transloco';
import {Store} from '@ngrx/store';
import {debounceTime, Subscription, tap} from 'rxjs';
import {formFeature} from '../state/form/reducers/form.reducer';
import {DownloadAssetComponent} from './components/download-asset/download-asset.component';
import {IntervalSelectionComponent} from './components/interval-selection/interval-selection.component';
import {MeasurementDataTypeSelectionComponent} from './components/measurement-data-type-selection/measurement-data-type-selection.component';
import {SelectionReviewComponent} from './components/selection-review/selection-review.component';
import {StationSelectionStepComponent} from './components/station-selection-step/station-selection-step.component';
import {TimeRangeSelectionComponent} from './components/time-range-selection/time-range-selection.component';
import type {FormStep} from '../shared/constants/form-step.constant';

@Component({
  selector: 'app-data-selection-form',
  imports: [
    TranslocoModule,
    MatButton,
    IntervalSelectionComponent,
    TimeRangeSelectionComponent,
    SelectionReviewComponent,
    DownloadAssetComponent,
    MatStepperModule,
    AsyncPipe,
    StationSelectionStepComponent,
    MeasurementDataTypeSelectionComponent,
    MatIcon,
    MatTooltip,
  ],
  templateUrl: './data-selection-form.component.html',
  styleUrl: './data-selection-form.component.scss',
})
export class DataSelectionFormComponent implements AfterViewInit, OnDestroy {
  private readonly store = inject(Store);

  @ViewChild(MatStepper) private readonly stepper: MatStepper | undefined;
  protected readonly selectedSelectedDataInterval$ = this.store.select(formFeature.selectSelectedDataInterval);
  protected readonly selectedSelectedTimeRange$ = this.store.select(formFeature.selectSelectedTimeRange);
  protected readonly selectedCollection$ = this.store.select(formFeature.selectSelectedCollection);
  private readonly initialStepDebounceTimeInMs = 100 as const;
  private readonly subscriptions: Subscription = new Subscription();

  public ngAfterViewInit(): void {
    this.subscriptions.add(
      this.store
        .select(formFeature.selectSelectedMeasurementDataType)
        .pipe(tap(() => this.stepper?.reset()))
        .subscribe(),
    );

    this.subscriptions.add(
      this.store
        .select(formFeature.selectInitialStep)
        .pipe(
          // wait for all collections/assets to be loaded
          debounceTime(this.initialStepDebounceTimeInMs),
          tap((initialStep) => this.setSelectedStep(initialStep)),
        )
        .subscribe(),
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private setSelectedStep(step: FormStep): void {
    const stepper = this.stepper;
    if (stepper) {
      stepper.selectedIndex = step;
    }
  }
}
