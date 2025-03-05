import {AsyncPipe} from '@angular/common';
import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {TranslocoDirective} from '@jsverse/transloco';
import {concatLatestFrom} from '@ngrx/operators';
import {Store} from '@ngrx/store';
import {combineLatestWith, map, Observable, startWith, Subscription, tap} from 'rxjs';
import {Station} from '../../../shared/models/station';
import {formActions} from '../../../state/form/actions/form.actions';
import {formFeature} from '../../../state/form/reducers/form.reducer';
import {selectStationsFilteredBySelectedParameterGroups} from '../../../state/stations/selectors/station.selector';

@Component({
  selector: 'app-station-selection',
  standalone: true,
  imports: [MatFormField, ReactiveFormsModule, MatAutocompleteTrigger, MatAutocomplete, MatOption, AsyncPipe, MatInput, TranslocoDirective],
  templateUrl: './station-selection.component.html',
  styleUrl: './station-selection.component.scss',
})
export class StationSelectionComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);

  protected formControl = new FormControl<string | Station>('');
  protected filteredStations$?: Observable<Station[]>;
  private readonly subscriptions = new Subscription();

  public ngOnInit(): void {
    const valueChanges$ = this.formControl.valueChanges.pipe(
      startWith(''),
      tap((value) => this.dispatchValueChange(value)),
      map((value): string => this.convertValueToString(value)),
    );
    this.filteredStations$ = this.store.select(selectStationsFilteredBySelectedParameterGroups).pipe(
      combineLatestWith(valueChanges$),
      map(([stations, value]) => this.filterStations(value, stations)),
    );
    this.subscriptions.add(
      this.store
        .select(formFeature.selectSelectedStationId)
        .pipe(
          concatLatestFrom(() => this.store.select(selectStationsFilteredBySelectedParameterGroups)),
          map(([stationId, stations]) => stations.find((station) => station.id === stationId) ?? null),
          tap((station) => this.formControl.patchValue(station)),
        )
        .subscribe(),
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  protected displayStationName(station: Station | null): string {
    return station?.displayName ? station.displayName : '';
  }

  private filterStations(value: string, stations: Station[]): Station[] {
    const lowerCaseValue = value.toLowerCase();
    return stations.filter((station) => station.name.toLowerCase().includes(lowerCaseValue));
  }

  private dispatchValueChange(value: string | Station | null): void {
    const stationIdOrNull = value === null || typeof value === 'string' ? null : value.id;
    this.store.dispatch(formActions.setSelectedStationId({stationId: stationIdOrNull}));
  }

  private convertValueToString(value: string | Station | null): string {
    return typeof value === 'string' ? value : this.displayStationName(value);
  }
}
