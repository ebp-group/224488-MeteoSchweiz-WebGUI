import {Component, inject, OnDestroy} from '@angular/core';
import {TranslocoModule, TranslocoService} from '@jsverse/transloco';
import {Store} from '@ngrx/store';
import {Station, StationParameter, StationParameterGroup, StationParameterMapping} from '../../shared/types/station.types';
import {Subscription} from 'rxjs';
import {stationFeature} from '../../state/station/reducers/station.reducer';
import {AsyncPipe} from '@angular/common';
import {TranslatableLabel} from '../../shared/types/translatable-label';
import {Language} from '../../shared/types/language.types';
import {formActions} from '../../state/form/actions/form.actions';

@Component({
  selector: 'app-parameter-list',
  standalone: true,
  imports: [TranslocoModule, AsyncPipe],
  templateUrl: './parameterList.component.html',
  styleUrl: './parameterList.component.scss',
})
export class ParameterListComponent implements OnDestroy {
  private readonly store = inject(Store);
  private readonly translocoService = inject(TranslocoService);

  private readonly subscriptions: Subscription = new Subscription();
  public readonly parameterGroups$ = this.store.select(stationFeature.selectStationParameterGroups);

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public translateTranslatableLabel(label: TranslatableLabel) {
    return label[this.translocoService.getActiveLang() as Language];
  }

  public selectParameterGroup(group: StationParameterGroup) {
    this.store.dispatch(formActions.selectParameterGroup({group}));
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
