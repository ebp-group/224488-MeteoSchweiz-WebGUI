import {AfterViewInit, Component, ElementRef, inject, OnDestroy, ViewChild} from '@angular/core';
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
  @ViewChild('map', {static: true}) private readonly openLayerMapElementRef!: ElementRef<HTMLDivElement>;

  public async ngAfterViewInit(): Promise<void> {
    await this.mapService.createMap(this.openLayerMapElementRef.nativeElement, mapConfig);
  }

  public ngOnDestroy(): void {
    this.mapService.removeMap();
  }
}
