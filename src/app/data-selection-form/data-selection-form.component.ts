import {Overlay, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {AsyncPipe} from '@angular/common';
import {AfterViewInit, Component, inject, OnDestroy, ViewChild} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatStepper, MatStepperModule} from '@angular/material/stepper';
import {TranslocoModule} from '@jsverse/transloco';
import {concatLatestFrom} from '@ngrx/operators';
import {Store} from '@ngrx/store';
import {filter, Subscription, take, tap} from 'rxjs';
import {formFeature} from '../state/form/reducers/form.reducer';
import {selectSelectedStationForCollection} from '../state/form/selectors/form.selector';
import {DownloadAssetComponent} from './components/download-asset/download-asset.component';
import {IntervalSelectionComponent} from './components/interval-selection/interval-selection.component';
import {LoadingSpinnerComponent} from './components/loading-spinner/loading-spinner.component';
import {MeasurementDataTypeSelectionComponent} from './components/measurement-data-type-selection/measurement-data-type-selection.component';
import {SelectionReviewComponent} from './components/selection-review/selection-review.component';
import {StationSelectionStepComponent} from './components/station-selection-step/station-selection-step.component';
import {StepLabelComponent} from './components/step-label/step-label.component';
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
    StepLabelComponent,
    MatIcon,
    MatProgressSpinnerModule,
  ],
  templateUrl: './data-selection-form.component.html',
  styleUrl: './data-selection-form.component.scss',
})
export class DataSelectionFormComponent implements AfterViewInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly overlay = inject(Overlay);

  private overlayRef: OverlayRef | undefined = undefined;

  @ViewChild(MatStepper) private readonly stepper: MatStepper | undefined;
  protected readonly selectedStationForCollection$ = this.store.select(selectSelectedStationForCollection);
  protected readonly selectedSelectedDataInterval$ = this.store.select(formFeature.selectSelectedDataInterval);
  protected readonly selectedSelectedTimeRange$ = this.store.select(formFeature.selectSelectedTimeRange);
  protected readonly selectedCollection$ = this.store.select(formFeature.selectSelectedCollection);
  private readonly subscriptions: Subscription = new Subscription();

  public ngAfterViewInit(): void {
    this.showLoadingIndicator();

    this.subscriptions.add(
      this.store
        .select(formFeature.selectSelectedMeasurementDataType)
        .pipe(tap(() => this.stepper?.reset()))
        .subscribe(),
    );

    this.subscriptions.add(
      this.store
        .select(formFeature.selectIsDataIntervalAndTimeRangeInitialized)
        .pipe(
          filter((isInitialized) => isInitialized),
          concatLatestFrom(() => this.store.select(formFeature.selectInitialStep)),
          tap(([, initialStep]) => {
            this.setSelectedStep(initialStep);
            this.hideLoadingIndicator();
          }),
          take(1),
        )
        .subscribe(),
    );
  }

  public ngOnDestroy(): void {
    this.hideLoadingIndicator();
    this.subscriptions.unsubscribe();
  }

  private setSelectedStep(step: FormStep): void {
    const stepper = this.stepper;
    if (stepper) {
      // If we write this value synchronously the stepper might not update in all cases
      // Using setTImeout ensures it happens in the next UI update cycle and the stepper reacts to the value change
      setTimeout(() => (stepper.selectedIndex = step));
    }
  }

  private showLoadingIndicator(): void {
    if (!this.overlayRef) {
      this.overlayRef = this.overlay.create({
        hasBackdrop: true,
        backdropClass: 'cdk-overlay-dark-backdrop',
        positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      });

      this.overlayRef.attach(new ComponentPortal(LoadingSpinnerComponent));
    }
  }

  private hideLoadingIndicator(): void {
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef.dispose();
      this.overlayRef = undefined;
    }
  }
}
