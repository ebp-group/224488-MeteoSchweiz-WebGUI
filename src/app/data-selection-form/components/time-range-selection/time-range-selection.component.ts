import {AsyncPipe} from '@angular/common';
import {Component, inject} from '@angular/core';
import {TranslocoModule} from '@jsverse/transloco';
import {Store} from '@ngrx/store';
import {formActions} from '../../../state/form/actions/form.actions';
import {formFeature} from '../../../state/form/reducers/form.reducer';
import type {TimeRange} from '../../../shared/models/time-range';

@Component({
  selector: 'app-time-range-selection',
  standalone: true,
  imports: [TranslocoModule, AsyncPipe],
  templateUrl: './time-range-selection.component.html',
  styleUrl: './time-range-selection.component.scss',
})
export class TimeRangeSelectionComponent {
  private readonly store = inject(Store);
  protected readonly selectedTimeRange$ = this.store.select(formFeature.selectSelectedTimeRange);

  protected setSelectedTimeRange(timeRange: TimeRange): void {
    this.store.dispatch(formActions.setSelectedTimeRange({timeRange}));
  }
}
