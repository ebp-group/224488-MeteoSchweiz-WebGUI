import {Component, inject, OnDestroy} from '@angular/core';
import {TranslocoModule, TranslocoService} from '@jsverse/transloco';
import {Store} from '@ngrx/store';
import {AssetInterval, Station, StationParameter, StationParameterGroup, StationParameterMapping} from '../../shared/types/station.types';
import {Subscription} from 'rxjs';
import {stationFeature} from '../../state/station/reducers/station.reducer';
import {AsyncPipe} from '@angular/common';
import {TranslatableLabel} from '../../shared/types/translatable-label';
import {Language} from '../../shared/types/language.types';
import {formActions} from '../../state/form/actions/form.actions';

@Component({
  selector: 'app-interval-selection',
  standalone: true,
  imports: [TranslocoModule, AsyncPipe],
  templateUrl: './interval-selection.component.html',
  styleUrl: './interval-selection.component.scss',
})
export class IntervalSelectionComponent implements OnDestroy {
  private readonly store = inject(Store);
  private readonly translocoService = inject(TranslocoService);

  private readonly subscriptions: Subscription = new Subscription();

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public setIntervalSelection(interval: AssetInterval) {
    this.store.dispatch(formActions.setIntervalSelection({interval}));
  }
}
