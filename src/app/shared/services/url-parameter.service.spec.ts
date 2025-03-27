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
      const fragment = 'lang=en&mdt=normal&pgid=123&sid=456&col=789&di=daily&tr=historical';
      const result = service.transformUrlFragmentToAppUrlParameter(fragment);
      expect(result).toEqual({
        language: 'en',
        measurementDataType: 'normal',
        parameterGroupId: '123',
        stationId: '456',
        collection: '789',
        dataInterval: 'daily',
        timeRange: 'historical',
      });
    });

    it('transforms invalid URL fragment to AppUrlParameter with default values', () => {
      const fragment = 'lang=invalid&mdt=invalid&di=invalid&tr=invalid';
      const result = service.transformUrlFragmentToAppUrlParameter(fragment);
      expect(result).toEqual({
        language: 'de',
        measurementDataType: 'normal',
        parameterGroupId: null,
        stationId: null,
        collection: null,
        dataInterval: null,
        timeRange: null,
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
      });
    });

    it('transforms an URL fragment to AppUrlParameter with default values where the parameters are empty', () => {
      const fragment = 'lang=&mdt=&pgid=&sid=&col=&di=&tr=';
      const result = service.transformUrlFragmentToAppUrlParameter(fragment);
      expect(result).toEqual({
        language: 'de',
        measurementDataType: 'normal',
        parameterGroupId: null,
        stationId: null,
        collection: null,
        dataInterval: null,
        timeRange: null,
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
      };
      service.setUrlFragment(appUrlParameter);

      expect(document.defaultView?.parent.postMessage).toHaveBeenCalledOnceWith(
        {src: 'lang=en&mdt=homogenous&pgid=123&sid=456&col=789&di=daily&tr=recent'},
        '*',
      );
    });

    it('sets only non-null values', () => {
      const appUrlParameter: AppUrlParameter = {
        language: 'fr',
        measurementDataType: 'normal',
        parameterGroupId: null,
        stationId: null,
        collection: null,
        dataInterval: null,
        timeRange: null,
      };
      service.setUrlFragment(appUrlParameter);

      expect(document.defaultView?.parent.postMessage).toHaveBeenCalledOnceWith({src: 'lang=fr&mdt=normal&pgid=&sid=&col=&di=&tr='}, '*');
    });
  });
});
