import {provideHttpClient} from '@angular/common/http';
import {TestBed} from '@angular/core/testing';
import {Action} from '@ngrx/store';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import {catchError, EMPTY, Observable, of} from 'rxjs';
import {MapService} from '../../../map/services/map.service';
import {MapLoadError} from '../../../shared/errors/map.error';
import {Station} from '../../../shared/models/station';
import {OpendataExplorerRuntimeErrorTestUtil} from '../../../shared/testing/utils/opendata-explorer-runtime-error-test.util';
import {formActions} from '../../form/actions/form.actions';
import {formFeature} from '../../form/reducers/form.reducer';
import {selectCurrentStationState, selectStationIdsFilteredBySelectedParameterGroups} from '../../stations/selectors/station.selector';
import {mapActions} from '../actions/map.action';
import {mapFeature} from '../reducers/map.reducer';
import {
  addStationsToMap,
  failLoadingMap,
  filterStationsOnMap,
  highlightSelectedStationOnMap,
  initializeMap,
  removeMap,
  toggleStationSelection,
} from './map.effects';

describe('MapEffects', () => {
  let actions$: Observable<Action>;
  let store: MockStore;
  let mapService: MapService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore(), provideHttpClient()],
    });
    store = TestBed.inject(MockStore);
    mapService = TestBed.inject(MapService);
  });

  afterEach(() => {
    store.resetSelectors();
  });

  it('should dispatch the setMapAsLoaded action after successfully loading map using the action loadMap', (done: DoneFn) => {
    spyOn(mapService, 'createInitialMapViewport').and.returnValue({center: {longitude: 0, latitude: 0}, zoom: 0, type: 'centerAndZoom'});
    spyOn(mapService, 'initializeMap').and.resolveTo();
    store.overrideSelector(mapFeature.selectMapsState, {center: {longitude: 0, latitude: 0}, zoom: 0, loadingState: 'loading'});
    actions$ = of(mapActions.loadMap());

    initializeMap(actions$, store, mapService).subscribe((action) => {
      expect(action).toEqual(mapActions.setMapAsLoaded());
      expect(mapService.createInitialMapViewport).toHaveBeenCalledTimes(1);
      expect(mapService.initializeMap).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it('should not call the service if the map is already loaded', (done: DoneFn) => {
    spyOn(mapService, 'initializeMap').and.resolveTo();
    store.overrideSelector(mapFeature.selectLoadingState, 'loaded');
    actions$ = of(mapActions.loadMap());

    initializeMap(actions$, store, mapService).subscribe({
      complete: () => {
        expect(mapService.initializeMap).not.toHaveBeenCalled();
        done();
      },
    });
  });

  it('should throw a MapError after dispatching setMapLoadingError', (done: DoneFn) => {
    const error = new Error('My cabbages!!!');
    const expectedError = new MapLoadError(error);

    actions$ = of(mapActions.setMapLoadingError({error}));
    failLoadingMap(actions$)
      .pipe(
        catchError((caughtError: unknown) => {
          OpendataExplorerRuntimeErrorTestUtil.expectToDeepEqual(caughtError, expectedError);
          done();
          return EMPTY;
        }),
      )
      .subscribe();
  });

  it('should remove the map when mapActions.resetState is dispatched', (done) => {
    spyOn(mapService, 'removeMap');
    actions$ = of(mapActions.resetState());
    removeMap(actions$, mapService).subscribe(() => {
      expect(mapService.removeMap).toHaveBeenCalledOnceWith();
      done();
    });
  });

  it('should add stations to the map when mapActions.setMapAsLoaded is dispatched', (done) => {
    spyOn(mapService, 'addStationsToMap');
    const stations: Station[] = [{id: '1', name: 'Station 1', displayName: 'DisplayName 1', coordinates: {longitude: 0, latitude: 0}}];
    store.overrideSelector(mapFeature.selectLoadingState, 'loaded');
    store.overrideSelector(selectCurrentStationState, {stations, loadingState: 'loaded'});
    actions$ = of(mapActions.setMapAsLoaded());
    addStationsToMap(actions$, store, mapService).subscribe(() => {
      expect(mapService.addStationsToMap).toHaveBeenCalledOnceWith(stations);
      done();
    });
  });

  it('should not add stations to the map when mapActions.setMapAsLoaded is dispatched while the map is not loaded yet', (done) => {
    spyOn(mapService, 'addStationsToMap');
    const stations: Station[] = [{id: '1', name: 'Station 1', displayName: 'DisplayName 1', coordinates: {longitude: 0, latitude: 0}}];
    store.overrideSelector(mapFeature.selectLoadingState, 'loading');
    store.overrideSelector(selectCurrentStationState, {stations, loadingState: 'loaded'});
    actions$ = of(mapActions.setMapAsLoaded());
    addStationsToMap(actions$, store, mapService).subscribe({
      complete: () => {
        expect(mapService.addStationsToMap).not.toHaveBeenCalled();
        done();
      },
    });
  });

  it('should not add stations to the map when mapActions.setMapAsLoaded is dispatched while the stations are not loaded yet', (done) => {
    spyOn(mapService, 'addStationsToMap');
    const stations: Station[] = [{id: '1', name: 'Station 1', displayName: 'DisplayName 1', coordinates: {longitude: 0, latitude: 0}}];
    store.overrideSelector(mapFeature.selectLoadingState, 'loaded');
    store.overrideSelector(selectCurrentStationState, {stations, loadingState: 'loading'});
    actions$ = of(mapActions.setMapAsLoaded());
    addStationsToMap(actions$, store, mapService).subscribe({
      complete: () => {
        expect(mapService.addStationsToMap).not.toHaveBeenCalled();
        done();
      },
    });
  });

  it('should filter stations on the map when mapActions.setMapAsLoaded is dispatched', (done) => {
    spyOn(mapService, 'filterStationsOnMap');
    const stationIds: string[] = ['1', '2'];
    store.overrideSelector(mapFeature.selectLoadingState, 'loaded');
    store.overrideSelector(selectStationIdsFilteredBySelectedParameterGroups, stationIds);
    actions$ = of(mapActions.setMapAsLoaded());
    filterStationsOnMap(actions$, store, mapService).subscribe(() => {
      expect(mapService.filterStationsOnMap).toHaveBeenCalledOnceWith(stationIds);
      done();
    });
  });

  it('should dispatch formActions.setSelectedStationId with an ID when mapActions.toggleStationSelection is dispatched with a new ID', (done) => {
    const stationId = '1';
    store.overrideSelector(formFeature.selectSelectedStationId, '2');
    actions$ = of(mapActions.toggleStationSelection({stationId}));
    toggleStationSelection(actions$, store).subscribe((action) => {
      expect(action).toEqual(formActions.setSelectedStationId({stationId}));
      done();
    });
  });

  it('should dispatch formActions.setSelectedStationId with `null` when mapActions.toggleStationSelection is dispatched with an existing ID', (done) => {
    const stationId = '1';
    store.overrideSelector(formFeature.selectSelectedStationId, '1');
    actions$ = of(mapActions.toggleStationSelection({stationId}));
    toggleStationSelection(actions$, store).subscribe((action) => {
      expect(action).toEqual(formActions.setSelectedStationId({stationId: null}));
      done();
    });
  });

  it('should highlight the selected station on the map when formActions.setSelectedStationId is dispatched with a new ID', (done) => {
    spyOn(mapService, 'highlightStation');
    spyOn(mapService, 'removeHighlight');
    const stationId = '1';
    store.overrideSelector(mapFeature.selectLoadingState, 'loaded');
    store.overrideSelector(formFeature.selectSelectedStationId, stationId);
    actions$ = of(formActions.setSelectedStationId({stationId}));
    highlightSelectedStationOnMap(actions$, store, mapService).subscribe(() => {
      expect(mapService.highlightStation).toHaveBeenCalledOnceWith(stationId);
      expect(mapService.removeHighlight).not.toHaveBeenCalled();
      done();
    });
  });

  it('should remove any highlight on the map when formActions.setSelectedStationId is dispatched with `null`', (done) => {
    spyOn(mapService, 'highlightStation');
    spyOn(mapService, 'removeHighlight');
    const stationId = null;
    store.overrideSelector(mapFeature.selectLoadingState, 'loaded');
    store.overrideSelector(formFeature.selectSelectedStationId, stationId);
    actions$ = of(formActions.setSelectedStationId({stationId}));
    highlightSelectedStationOnMap(actions$, store, mapService).subscribe(() => {
      expect(mapService.highlightStation).not.toHaveBeenCalled();
      expect(mapService.removeHighlight).toHaveBeenCalledOnceWith();
      done();
    });
  });
});
