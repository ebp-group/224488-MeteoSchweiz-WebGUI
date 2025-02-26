import {AfterViewInit, Component, ElementRef, inject, OnDestroy, ViewChild} from '@angular/core';
import {Store} from '@ngrx/store';
import {mapConfig} from '../../../shared/configs/map.config';
import {mapActions} from '../../../state/map/actions/map.action';
import {MapService} from '../../services/map.service';

@Component({
  selector: 'app-map-container',
  standalone: true,
  imports: [],
  templateUrl: './map-container.component.html',
  styleUrl: './map-container.component.scss',
})
export class MapContainerComponent implements AfterViewInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly mapService = inject(MapService);
  @ViewChild('map', {static: true}) private readonly openLayerMapElementRef!: ElementRef<HTMLDivElement>;

  public ngAfterViewInit(): void {
    this.mapService.createMap(this.openLayerMapElementRef.nativeElement, mapConfig);
    this.store.dispatch(mapActions.loadMap());
  }

  public ngOnDestroy(): void {
    this.store.dispatch(mapActions.resetState());
  }
}
