import {TestBed} from '@angular/core/testing';
import {Action} from '@ngrx/store';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import {Observable, of} from 'rxjs';
import {collectionConfig} from '../../../shared/configs/collections.config';
import {AppUrlParameter} from '../../../shared/models/app-url-parameter';
import {UrlParameterService} from '../../../shared/services/url-parameter.service';
import {appActions} from '../../app/actions/app.actions';
import {collectionActions} from '../../collection/actions/collection.action';
import {selectCurrentParameterState, selectParameterGroups} from '../../parameters/selectors/parameter.selector';
import {ParameterStateEntry} from '../../parameters/states/parameter.state';
import {selectCurrentStationState} from '../../stations/selectors/station.selector';
import {StationStateEntry} from '../../stations/states/station.state';
import {formActions} from '../actions/form.actions';
import {
  initializeSelectedMeasurementDataType,
  initializeSelectedStationAndParameterGroupId,
  loadCollectionsForSelectedMeasurementDataType,
  setSelectedMeasurementDataTypeInUrl,
  setSelectedParameterGroupIdInUrl,
  setSelectedStationIdInUrl,
} from './form.effects';

describe('FormEffects', () => {
  const measurementDataType = collectionConfig.defaultMeasurementDataType;

  let actions$: Observable<Action>;
  let store: MockStore;

  beforeEach(() => {
    actions$ = new Observable<Action>();
    TestBed.configureTestingModule({providers: [provideMockStore()]});
    store = TestBed.inject(MockStore);
  });

  afterEach(() => {
    store.resetSelectors();
  });

  it('should dispatch loadCollection action when setSelectedMeasurementDataType is dispatched', (done: DoneFn) => {
    actions$ = of(formActions.setSelectedMeasurementDataType({measurementDataType}));

    loadCollectionsForSelectedMeasurementDataType(actions$).subscribe((action) => {
      expect(action).toEqual(
        collectionActions.loadCollections({collections: collectionConfig.collections[measurementDataType], measurementDataType}),
      );
      done();
    });
  });

  it('should dispatch setSelectedMeasurementDataType action when initializeApp is dispatched', (done: DoneFn) => {
    actions$ = of(appActions.initializeApp({parameter: {measurementDataType: 'homogenous'} as AppUrlParameter}));
    initializeSelectedMeasurementDataType(actions$).subscribe((action) => {
      expect(action).toEqual(formActions.setSelectedMeasurementDataType({measurementDataType: 'homogenous'}));
      done();
    });
  });

  describe('initializeSelectedStationAndParameterGroupId', () => {
    it('should dispatch setSelectedParameterGroupAndStationId action when initializeApp is dispatched', (done) => {
      store.overrideSelector(selectCurrentParameterState, {loadingState: 'loaded'} as ParameterStateEntry);
      store.overrideSelector(selectCurrentStationState, {
        loadingState: 'loaded',
        stations: [
          {
            id: '456',
            name: '',
            displayName: '',
            coordinates: {longitude: 0, latitude: 0},
          },
        ],
      } as StationStateEntry);
      store.overrideSelector(selectParameterGroups, [{id: '123', name: {de: 'de', fr: 'fr', it: 'it', en: 'en'}}]);
      actions$ = of(appActions.initializeApp({parameter: {parameterGroupId: '123', stationId: '456'} as AppUrlParameter}));
      initializeSelectedStationAndParameterGroupId(actions$, store).subscribe((action) => {
        expect(action).toEqual(formActions.setSelectedParameterGroupAndStationId({parameterGroupId: '123', stationId: '456'}));
        done();
      });
    });

    it('should replace invalid station IDs with `null`', (done) => {
      store.overrideSelector(selectCurrentParameterState, {loadingState: 'loaded'} as ParameterStateEntry);
      store.overrideSelector(selectCurrentStationState, {
        loadingState: 'loaded',
        stations: [
          {
            id: '456',
            name: '',
            displayName: '',
            coordinates: {longitude: 0, latitude: 0},
          },
        ],
      } as StationStateEntry);
      store.overrideSelector(selectParameterGroups, [{id: '123', name: {de: 'de', fr: 'fr', it: 'it', en: 'en'}}]);
      actions$ = of(appActions.initializeApp({parameter: {parameterGroupId: '123', stationId: 'invalid'} as AppUrlParameter}));
      initializeSelectedStationAndParameterGroupId(actions$, store).subscribe((action) => {
        expect(action).toEqual(formActions.setSelectedParameterGroupAndStationId({parameterGroupId: '123', stationId: null}));
        done();
      });
    });

    it('should replace invalid parameter group IDs with `null`', (done) => {
      store.overrideSelector(selectCurrentParameterState, {loadingState: 'loaded'} as ParameterStateEntry);
      store.overrideSelector(selectCurrentStationState, {
        loadingState: 'loaded',
        stations: [
          {
            id: '456',
            name: '',
            displayName: '',
            coordinates: {longitude: 0, latitude: 0},
          },
        ],
      } as StationStateEntry);
      store.overrideSelector(selectParameterGroups, [{id: '123', name: {de: 'de', fr: 'fr', it: 'it', en: 'en'}}]);
      actions$ = of(appActions.initializeApp({parameter: {parameterGroupId: 'invalid', stationId: '456'} as AppUrlParameter}));
      initializeSelectedStationAndParameterGroupId(actions$, store).subscribe((action) => {
        expect(action).toEqual(formActions.setSelectedParameterGroupAndStationId({parameterGroupId: null, stationId: '456'}));
        done();
      });
    });
  });

  describe('set URL parameter', () => {
    let urlParameterService: jasmine.SpyObj<UrlParameterService>;

    beforeEach(() => {
      urlParameterService = jasmine.createSpyObj('UrlParameterService', ['setMeasurementDataType', 'setParameterGroupId', 'setStationId']);
      urlParameterService.setMeasurementDataType.and.returnValue(of(undefined));
      urlParameterService.setParameterGroupId.and.returnValue(of(undefined));
      urlParameterService.setStationId.and.returnValue(of(undefined));
    });

    it('should call the urlParameterService when formActions.setSelectedMeasurementDataType is dispatched', (done: DoneFn) => {
      actions$ = of(formActions.setSelectedMeasurementDataType({measurementDataType: 'homogenous'}));
      setSelectedMeasurementDataTypeInUrl(actions$, urlParameterService).subscribe(() => {
        expect(urlParameterService.setMeasurementDataType).toHaveBeenCalledOnceWith('homogenous');
        done();
      });
    });

    it('should call the urlParameterService when formActions.setSelectedParameters is dispatched', (done: DoneFn) => {
      actions$ = of(formActions.setSelectedParameters({parameterGroupId: 'test'}));
      setSelectedParameterGroupIdInUrl(actions$, urlParameterService).subscribe(() => {
        expect(urlParameterService.setParameterGroupId).toHaveBeenCalledOnceWith('test');
        done();
      });
    });

    it('should call the urlParameterService when formActions.setSelectedStationId is dispatched', (done: DoneFn) => {
      actions$ = of(formActions.setSelectedStationId({stationId: 'test'}));
      setSelectedStationIdInUrl(actions$, urlParameterService).subscribe(() => {
        expect(urlParameterService.setStationId).toHaveBeenCalledOnceWith('test');
        done();
      });
    });
  });
});
