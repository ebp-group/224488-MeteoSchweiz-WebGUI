import {AfterViewInit, Component, ElementRef, inject, OnDestroy, ViewChild} from '@angular/core';
import {Map} from 'maplibre-gl';
import {mapConfig} from '../../../shared/configs/map.config';
import {MapService} from '../../services/map.service';

@Component({
  selector: 'app-map-container',
  standalone: true,
  imports: [],
  templateUrl: './map-container.component.html',
  styleUrl: './map-container.component.scss',
})
export class MapContainerComponent implements AfterViewInit, OnDestroy {
  private readonly mapService = inject(MapService);
  private mapInstance?: Map;
  @ViewChild('map', {static: true}) private readonly openLayerMapElementRef!: ElementRef<HTMLDivElement>;

  public async ngAfterViewInit(): Promise<void> {
    this.mapInstance = await this.mapService.createMap(this.openLayerMapElementRef.nativeElement, mapConfig);
  }

  public ngOnDestroy(): void {
    this.mapInstance?.remove();
  }
}
