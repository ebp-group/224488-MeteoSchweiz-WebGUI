import {AsyncPipe, DatePipe} from '@angular/common';
import {Component, inject} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MatRadioModule} from '@angular/material/radio';
import {MatTooltip} from '@angular/material/tooltip';
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
  imports: [TranslocoModule, AsyncPipe, DatePipe, IncludesPipe, MatRadioModule, MatIcon, MatTooltip],
  templateUrl: './time-range-selection.component.html',
  styleUrl: './time-range-selection.component.scss',
})
export class TimeRangeSelectionComponent {
  private readonly store = inject(Store);

  protected readonly selectedTimeRange$ = this.store.select(formFeature.selectSelectedTimeRange);
  protected readonly availableTimeRanges$ = this.store.select(selectAvailableTimeRanges);
  protected readonly historicalDateRanges$ = this.store.select(selectSortedHistoricalDateRanges);

  protected setSelectedTimeRange(timeRange: TimeRange | DateRange): void {
    if (typeof timeRange === 'string') {
      this.store.dispatch(formActions.setSelectedTimeRange({timeRange, historicalDateRange: null}));
    } else {
      this.store.dispatch(formActions.setSelectedTimeRange({timeRange: 'historical', historicalDateRange: timeRange}));
    }
  }
}
