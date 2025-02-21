import {AsyncPipe} from '@angular/common';
import {Component, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {MatStepperModule} from '@angular/material/stepper';
import {TranslocoModule, TranslocoService} from '@jsverse/transloco';
import {Store} from '@ngrx/store';
import {collectionActions} from '../state/collection/actions/collection.action';
import {formFeature} from '../state/form/reducers/form.reducer';
import {DownloadAssetComponent} from './components/download-asset/download-asset.component';
import {IntervalSelectionComponent} from './components/interval-selection/interval-selection.component';
import {ParameterListComponent} from './components/parameter-list/parameter-list.component';
import {SelectionOverviewComponent} from './components/selection-overview/selection-overview.component';
import {TimeRangeSelectionComponent} from './components/time-range-selection/time-range-selection.component';
import type {Language} from '../shared/models/language';

@Component({
  selector: 'app-data-selection-form',
  standalone: true,
  imports: [
    TranslocoModule,
    MatButton,
    MatButtonToggleGroup,
    MatButtonToggle,
    ParameterListComponent,
    IntervalSelectionComponent,
    TimeRangeSelectionComponent,
    SelectionOverviewComponent,
    DownloadAssetComponent,
    MatStepperModule,
    AsyncPipe,
  ],
  templateUrl: './data-selection-form.component.html',
  styleUrl: './data-selection-form.component.scss',
})
export class DataSelectionFormComponent {
  private readonly translocoService = inject(TranslocoService);
  private readonly store = inject(Store);

  protected readonly selectedParameterGroup$ = this.store.select(formFeature.selectSelectedParameterGroupId);
  protected readonly selectedSelectedDataInterval$ = this.store.select(formFeature.selectSelectedDataInterval);
  protected readonly selectedSelectedTimeRange$ = this.store.select(formFeature.selectSelectedTimeRange);

  protected changeLanguage(language: Language): void {
    this.translocoService.setActiveLang(language);
  }

  protected testError(): void {
    throw new Error('Test');
  }

  protected testCsv(): void {
    this.store.dispatch(collectionActions.loadCollections({collections: ['ch.meteoschweiz.ogd-smn', 'ch.meteoschweiz.ogd-smn-precip']}));
  }
}
