import {AsyncPipe} from '@angular/common';
import {Component, inject} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {Store} from '@ngrx/store';
import {MapContainerComponent} from '../../../map/components/map-container/map-container.component';
import {selectSelectedStationForCollection} from '../../../state/form/selectors/form.selector';
import {CollectionSelectionComponent} from '../collection-selection/collection-selection.component';
import {ParameterGroupSelectionComponent} from '../parameter-group-selection/parameter-group-selection.component';
import {StationSelectionComponent} from '../station-selection/station-selection.component';

@Component({
  selector: 'app-station-selection-step',
  imports: [
    CollectionSelectionComponent,
    MapContainerComponent,
    ParameterGroupSelectionComponent,
    StationSelectionComponent,
    AsyncPipe,
    TranslocoDirective,
  ],
  templateUrl: './station-selection-step.component.html',
  styleUrl: './station-selection-step.component.scss',
})
export class StationSelectionStepComponent {
  private readonly store = inject(Store);

  protected readonly selectedStation$ = this.store.select(selectSelectedStationForCollection);
}
