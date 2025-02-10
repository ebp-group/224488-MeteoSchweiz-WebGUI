import {AsyncPipe} from '@angular/common';
import {Component, inject} from '@angular/core';
import {TranslocoModule} from '@jsverse/transloco';
import {Store} from '@ngrx/store';
import {dataInterval} from '../../../shared/models/interval';
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

  protected readonly availableDataInterval = dataInterval;

  protected setSelectedInterval(interval: DataInterval) {
    this.store.dispatch(formActions.setSelectedDataInterval({dataInterval: interval}));
  }
}
