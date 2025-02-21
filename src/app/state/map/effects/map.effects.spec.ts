import {TestBed} from '@angular/core/testing';
import {Action} from '@ngrx/store';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import {Observable, of} from 'rxjs';
import {MapService} from '../../../map/services/map.service';
import {Station} from '../../../shared/models/station';
import {formActions} from '../../form/actions/form.actions';
import {stationActions} from '../../stations/actions/station.action';
import {stationFeature} from '../../stations/reducers/station.reducer';
import {addStationsToMap, filterStationsOnMap} from './map.effects';

describe('MapEffects', () => {
  let actions$: Observable<Action>;
  let store: MockStore;
  let mapService: jasmine.SpyObj<MapService>;

  beforeEach(() => {
    mapService = jasmine.createSpyObj('MapService', ['addStationsToMap', 'filterStationsOnMap']);
    TestBed.configureTestingModule({
      providers: [provideMockStore()],
    });
    store = TestBed.inject(MockStore);
  });

  afterEach(() => {
    store.resetSelectors();
  });

  it('should add stations to the map when stationActions.setLoadedStations is dispatched', (done) => {
    const stations: Station[] = [{id: '1', name: 'Station 1', coordinates: {lng: 0, lat: 0}}];
    actions$ = of(stationActions.setLoadedStations({stations}));
    addStationsToMap(actions$, mapService).subscribe(() => {
      expect(mapService.addStationsToMap).toHaveBeenCalledOnceWith(stations);
      done();
    });
  });

  it('should filter stations on the map when formActions.setSelectedParameters is dispatched', (done) => {
    const stations: Station[] = [{id: '1', name: 'Station 1', coordinates: {lng: 0, lat: 0}}];
    store.overrideSelector(stationFeature.selectStations, stations);
    actions$ = of(formActions.setSelectedParameters({parameterGroupId: 'test-group-id'}));
    filterStationsOnMap(actions$, store, mapService).subscribe(() => {
      expect(mapService.filterStationsOnMap).toHaveBeenCalledOnceWith(stations);
      done();
    });
  });
});
