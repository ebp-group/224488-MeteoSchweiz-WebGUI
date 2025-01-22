import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {TranslocoModule, TranslocoService} from '@jsverse/transloco';
import {Store} from '@ngrx/store';
import {Station, StationParameter, StationParameterMapping} from '../../shared/types/station.types';
import {Subscription, tap} from 'rxjs';
import {StationState} from '../../state/station/state/station.state';
import {initialState, stationFeature} from '../../state/station/reducers/station.reducer';
import {AsyncPipe} from '@angular/common';
import {TranslatableLabel} from '../../shared/types/translatable-label';
import {Language} from '../../shared/types/language.types';

@Component({
  selector: 'app-station-list',
  standalone: true,
  imports: [TranslocoModule, AsyncPipe],
  templateUrl: './station-list.component.html',
  styleUrl: './station-list.component.scss',
})
export class StationListComponent implements OnDestroy {
  private readonly store = inject(Store);
  private readonly translocoService = inject(TranslocoService);

  private readonly subscriptions: Subscription = new Subscription();
  public readonly stations$ = this.store.select(stationFeature.selectStations);

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public translateTranslatableLabel(label: TranslatableLabel) {
    return label[this.translocoService.getActiveLang() as Language];
  }

  private combineMapping(mappings: StationParameterMapping[]): void {
    // mappings.forEach((map) =>
    //   this.stations.forEach(
    //     (station) =>
    //       map.stationAbbreviation === station.abbreviation &&
    //       this.parameters.forEach(
    //         (parameter) => map.parameterShortname === parameter.shortname && console.log(map, parameter.description.de),
    //       ),
    //   ),
    // );
  }
}
