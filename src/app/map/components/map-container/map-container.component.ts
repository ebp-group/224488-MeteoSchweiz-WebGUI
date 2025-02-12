import {AfterViewInit, Component, ElementRef, inject, OnDestroy, ViewChild} from '@angular/core';
import {MapService} from '../../services/map.service';
import {Map} from 'ol';
import {mapConfig} from '../../../shared/configs/map.config';

@Component({
  selector: 'app-map-container',
  standalone: true,
  imports: [],
  templateUrl: './map-container.component.html',
  styleUrl: './map-container.component.scss',
})
export class MapContainerComponent implements AfterViewInit, OnDestroy {
  private readonly mapService = inject(MapService);
  private map?: Map;
  @ViewChild('map', {static: true}) private readonly openLayerMapElementRef!: ElementRef<HTMLDivElement>;

  public async ngAfterViewInit() {
    this.map = await this.mapService.createMap(this.openLayerMapElementRef.nativeElement, mapConfig);
  }

  public ngOnDestroy(): void {
    this.map?.dispose();
  }
}
