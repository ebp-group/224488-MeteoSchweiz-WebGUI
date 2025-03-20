import {AsyncPipe, DatePipe} from '@angular/common';
import {Component, inject} from '@angular/core';
import {TranslocoModule} from '@jsverse/transloco';
import {Store} from '@ngrx/store';
import {IncludesPipe} from '../../../shared/pipes/includes.pipe';
import {selectAvailableTimeRanges, selectSortedHistoricalDateRanges} from '../../../state/assets/selectors/asset.selectors';
import {formActions} from '../../../state/form/actions/form.actions';
import {formFeature} from '../../../state/form/reducers/form.reducer';
import type {DateRange} from '../../../shared/models/date-range';
import type {TimeRange} from '../../../shared/models/time-range';

@Component({
  selector: 'app-time-range-selection',
  imports: [TranslocoModule, AsyncPipe, DatePipe, IncludesPipe],
  templateUrl: './time-range-selection.component.html',
  styleUrl: './time-range-selection.component.scss',
})
export class TimeRangeSelectionComponent {
  private readonly store = inject(Store);

  protected readonly selectedTimeRange$ = this.store.select(formFeature.selectSelectedTimeRange);
  protected readonly selectedHistoricalDateRange$ = this.store.select(formFeature.selectSelectedHistoricalDateRange);
  protected readonly availableTimeRanges$ = this.store.select(selectAvailableTimeRanges);
  protected readonly historicalDateRanges$ = this.store.select(selectSortedHistoricalDateRanges);

  protected setSelectedTimeRange(timeRange: TimeRange, historicalDateRange: DateRange | null): void {
    this.store.dispatch(formActions.setSelectedTimeRange({timeRange, historicalDateRange}));
  }
}
