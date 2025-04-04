import {AsyncPipe} from '@angular/common';
import {Component, inject} from '@angular/core';
import {MatRadioModule} from '@angular/material/radio';
import {TranslocoModule} from '@jsverse/transloco';
import {marker} from '@jsverse/transloco-keys-manager/marker';
import {Store} from '@ngrx/store';
import {dataIntervals} from '../../../shared/models/interval';
import {IncludesPipe} from '../../../shared/pipes/includes.pipe';
import {selectAvailableDataIntervals} from '../../../state/assets/selectors/asset.selectors';
import {formActions} from '../../../state/form/actions/form.actions';
import {formFeature} from '../../../state/form/reducers/form.reducer';
import type {DataInterval} from '../../../shared/models/interval';

@Component({
  selector: 'app-interval-selection',
  imports: [TranslocoModule, AsyncPipe, IncludesPipe, MatRadioModule],
  templateUrl: './interval-selection.component.html',
  styleUrl: './interval-selection.component.scss',
})
export class IntervalSelectionComponent {
  private readonly store = inject(Store);

  private readonly dataIntervalLabelMapping: Record<DataInterval, string> = {
    'ten-minutes': marker('form.interval.ten-minutes'),
    hourly: marker('form.interval.hourly'),
    daily: marker('form.interval.daily'),
    monthly: marker('form.interval.monthly'),
    yearly: marker('form.interval.yearly'),
  };

  protected readonly selectedDataInterval$ = this.store.select(formFeature.selectSelectedDataInterval);

  protected readonly allDataIntervals = dataIntervals.map((interval) => ({
    interval,
    label: this.dataIntervalLabelMapping[interval],
  }));
  protected readonly availableDataIntervals$ = this.store.select(selectAvailableDataIntervals);

  protected setSelectedInterval(interval: DataInterval): void {
    this.store.dispatch(formActions.setSelectedDataInterval({dataInterval: interval}));
  }
}
