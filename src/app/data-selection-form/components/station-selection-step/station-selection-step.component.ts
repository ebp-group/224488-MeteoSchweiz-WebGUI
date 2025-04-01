import {Component} from '@angular/core';
import {MapContainerComponent} from '../../../map/components/map-container/map-container.component';
import {CollectionSelectionComponent} from '../collection-selection/collection-selection.component';
import {ParameterGroupSelectionComponent} from '../parameter-group-selection/parameter-group-selection.component';
import {StationSelectionComponent} from '../station-selection/station-selection.component';

@Component({
  selector: 'app-station-selection-step',
  imports: [CollectionSelectionComponent, MapContainerComponent, ParameterGroupSelectionComponent, StationSelectionComponent],
  templateUrl: './station-selection-step.component.html',
  styleUrl: './station-selection-step.component.scss',
})
export class StationSelectionStepComponent {}
