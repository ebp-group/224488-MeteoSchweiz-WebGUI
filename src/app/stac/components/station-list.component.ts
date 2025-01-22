import {Component, inject, OnDestroy} from '@angular/core';
import {TranslocoModule, TranslocoService} from '@jsverse/transloco';
import {createSelector, Store} from '@ngrx/store';
import {Station, StationParameterMapping} from '../../shared/types/station.types';
import {combineLatest, filter, map, Subscription, tap, withLatestFrom} from 'rxjs';
import {stationFeature} from '../../state/station/reducers/station.reducer';
import {AsyncPipe} from '@angular/common';
import {TranslatableLabel} from '../../shared/types/translatable-label';
import {Language} from '../../shared/types/language.types';
import {formFeature} from '../../state/form/reducers/form.reducer';
import {formActions} from '../../state/form/actions/form.actions';

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
  private readonly selectedGroup$ = this.store.select(formFeature.selectSelectedParameterGroup);
  private readonly stationParameterMappings$ = this.store.select(stationFeature.selectStationParameterMappings);
  private stationAbbreviationSelector = createSelector(formFeature.selectSelectedStation, (station) => station?.abbreviation);

  public readonly stations$ = combineLatest([this.store.select(stationFeature.selectStations), this.selectedGroup$]).pipe(
    withLatestFrom(this.stationParameterMappings$),
    map(([[stations, selectedGroup], mappings]) =>
      stations.filter(
        (station) =>
          selectedGroup == null ||
          mappings
            .filter((mapping) => mapping.stationAbbreviation === station.abbreviation)
            .some((mapping) => selectedGroup?.parameters.map((parameter) => parameter.shortname).includes(mapping.parameterShortname)),
      ),
    ),
  );

  public selectedStationAbbreviation$ = this.store.select(this.stationAbbreviationSelector);

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public selectStation(station: Station) {
    this.store.dispatch(formActions.selectStation({station}));
  }

  public translateTranslatableLabel(label: TranslatableLabel) {
    return label[this.translocoService.getActiveLang() as Language];
  }
}
