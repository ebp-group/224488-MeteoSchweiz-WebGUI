import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {TranslocoModule, TranslocoService} from '@jsverse/transloco';
import {Store} from '@ngrx/store';
import {Station} from '../../shared/types/station.types';
import {Subscription, tap} from 'rxjs';
import {StationState} from '../../state/station/state/station.state';
import {initialState, stationFeature} from '../../state/station/reducers/station.reducer';
import {AsyncPipe} from '@angular/common';
import {TranslatableLabel} from '../../shared/types/translatable-label';
import {Language} from '../../shared/types/language.types';

@Component({
  selector: 'app-station',
  standalone: true,
  imports: [TranslocoModule, AsyncPipe],
  templateUrl: './station.component.html',
  styleUrl: './station.component.scss',
})
export class StationComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly translocoService = inject(TranslocoService);

  private readonly subscriptions: Subscription = new Subscription();
  private readonly stations$ = this.store.select(stationFeature.selectStations);
  public readonly parameters$ = this.store.select(stationFeature.selectStationParameters);

  public stations: Station[] = [];

  public ngOnInit(): void {
    this.subscriptions.add(this.stations$.pipe(tap((stations) => (this.stations = stations))).subscribe());
  }
  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public translateTranslatableLabel(label: TranslatableLabel) {
    return label[this.translocoService.getActiveLang() as Language];
  }
}
