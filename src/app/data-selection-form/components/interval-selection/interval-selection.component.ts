import {AsyncPipe} from '@angular/common';
import {Component, inject} from '@angular/core';
import {TranslocoModule} from '@jsverse/transloco';
import {Store} from '@ngrx/store';
import {dataIntervals} from '../../../shared/models/interval';
import {formActions} from '../../../state/form/actions/form.actions';
import {formFeature} from '../../../state/form/reducers/form.reducer';
import type {DataInterval} from '../../../shared/models/interval';

@Component({
  selector: 'app-interval-selection',
  standalone: true,
  imports: [TranslocoModule, AsyncPipe],
  templateUrl: './interval-selection.component.html',
  styleUrl: './interval-selection.component.scss',
})
export class IntervalSelectionComponent {
  private readonly store = inject(Store);
  protected readonly selectedDataInterval$ = this.store.select(formFeature.selectSelectedDataInterval);

  protected readonly availableDataIntervals = dataIntervals;

  protected setSelectedInterval(interval: DataInterval): void {
    this.store.dispatch(formActions.setSelectedDataInterval({dataInterval: interval}));
  }
}
