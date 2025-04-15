import {TestBed} from '@angular/core/testing';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import {selectCurrentAppUrlParameter} from '../../state/app/selectors/app.selector';
import {AppUrlParameter} from '../models/app-url-parameter';
import {UrlParameterService} from './url-parameter.service';

describe('UrlParameterService', () => {
  let service: UrlParameterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()],
    });
    service = TestBed.inject(UrlParameterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('transformUrlFragmentToAppUrlParameter', () => {
    it('transforms URL fragment to AppUrlParameter correctly', () => {
      const fragment = 'lang=en&mdt=normal&pgid=123&sid=456&col=789&di=daily&tr=historical&hdr=2021-2022';
      const result = service.transformUrlFragmentToAppUrlParameter(fragment);
      expect(result).toEqual({
        language: 'en',
        measurementDataType: 'normal',
        parameterGroupId: '123',
        stationId: '456',
        collection: '789',
        dataInterval: 'daily',
        timeRange: 'historical',
        historicalDateRange: {start: jasmine.any(Date), end: jasmine.any(Date)},
      });
    });

    it('transforms invalid URL fragment to AppUrlParameter with default values', () => {
      const fragment = 'lang=invalid&mdt=invalid&di=invalid&tr=invalid&hdr=invalid';
      const result = service.transformUrlFragmentToAppUrlParameter(fragment);
      expect(result).toEqual({
        language: 'de',
        measurementDataType: 'normal',
        parameterGroupId: null,
        stationId: null,
        collection: null,
        dataInterval: null,
        timeRange: null,
        historicalDateRange: null,
      });
    });

    it('transforms an undefined URL fragment to AppUrlParameter with default values', () => {
      const result = service.transformUrlFragmentToAppUrlParameter(undefined);
      expect(result).toEqual({
        language: 'de',
        measurementDataType: 'normal',
        parameterGroupId: null,
        stationId: null,
        collection: null,
        dataInterval: null,
        timeRange: null,
        historicalDateRange: null,
      });
    });

    it('transforms historicalDateRange to null for a date range string with invalid format', () => {
      const fragment = 'hdr=20230101/20231231';
      const result = service.transformUrlFragmentToAppUrlParameter(fragment);
      expect(result).toEqual(jasmine.objectContaining({historicalDateRange: null}));
    });

    it('transforms historicalDateRange to null for a date range string with non-numeric characters', () => {
      const fragment = 'hdr=202A-202C';
      const result = service.transformUrlFragmentToAppUrlParameter(fragment);
      expect(result).toEqual(jasmine.objectContaining({historicalDateRange: null}));
    });

    it('transforms historicalDateRange to null for a date range string with incomplete dates', () => {
      const fragment = 'hdr=2023-202';
      const result = service.transformUrlFragmentToAppUrlParameter(fragment);
      expect(result).toEqual(jasmine.objectContaining({historicalDateRange: null}));
    });

    it('transforms an URL fragment to AppUrlParameter with default values where the parameters are empty', () => {
      const fragment = 'lang=&mdt=&pgid=&sid=&col=&di=&tr=&hdr=';
      const result = service.transformUrlFragmentToAppUrlParameter(fragment);
      expect(result).toEqual({
        language: 'de',
        measurementDataType: 'normal',
        parameterGroupId: null,
        stationId: null,
        collection: null,
        dataInterval: null,
        timeRange: null,
        historicalDateRange: null,
      });
    });
  });

  describe('setUrlFragment', () => {
    beforeEach(() => {
      const appUrlParameter: AppUrlParameter = {
        language: 'en',
        measurementDataType: 'homogenous',
        parameterGroupId: '123',
        stationId: '456',
        collection: '789',
        dataInterval: 'daily',
        timeRange: 'recent',
        historicalDateRange: {start: new Date('2021-01-01'), end: new Date('2022-01-01')},
      };
      const store = TestBed.inject(MockStore);
      store.overrideSelector(selectCurrentAppUrlParameter, appUrlParameter);
      spyOn(document.defaultView!.parent, 'postMessage');
    });

    it('sets all given parameters', () => {
      const appUrlParameter: AppUrlParameter = {
        language: 'en',
        measurementDataType: 'homogenous',
        parameterGroupId: '123',
        stationId: '456',
        collection: '789',
        dataInterval: 'daily',
        timeRange: 'recent',
        historicalDateRange: {start: new Date('2021-01-01'), end: new Date('2022-01-01')},
      };
      service.setUrlFragment(appUrlParameter);

      expect(document.defaultView?.parent.postMessage).toHaveBeenCalledOnceWith(
        {src: 'lang=en&mdt=homogenous&pgid=123&sid=456&col=789&di=daily&tr=recent&hdr=2021-2022'},
        '*',
      );
    });

    it('sets null values as empty parameters', () => {
      const appUrlParameter: AppUrlParameter = {
        language: 'fr',
        measurementDataType: 'normal',
        parameterGroupId: null,
        stationId: null,
        collection: null,
        dataInterval: null,
        timeRange: null,
        historicalDateRange: null,
      };
      service.setUrlFragment(appUrlParameter);

      expect(document.defaultView?.parent.postMessage).toHaveBeenCalledOnceWith(
        {src: 'lang=fr&mdt=normal&pgid=&sid=&col=&di=&tr=&hdr='},
        '*',
      );
    });
  });
});
