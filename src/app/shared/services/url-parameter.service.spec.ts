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

  it('transforms URL fragment to AppUrlParameter correctly', () => {
    const fragment = 'lang=en&mdt=normal&pgid=123&sid=456';
    const result = service.transformUrlFragmentToAppUrlParameter(fragment);
    expect(result).toEqual({
      language: 'en',
      measurementDataType: 'normal',
      parameterGroupId: '123',
      stationId: '456',
    });
  });

  it('transforms invalid URL fragment to AppUrlParameter with default values', () => {
    const fragment = 'lang=invalid&mdt=invalid';
    const result = service.transformUrlFragmentToAppUrlParameter(fragment);
    expect(result).toEqual({
      language: 'de',
      measurementDataType: 'normal',
      parameterGroupId: null,
      stationId: null,
    });
  });

  it('transforms an undefined URL fragment to AppUrlParameter with default values', () => {
    const result = service.transformUrlFragmentToAppUrlParameter(undefined);
    expect(result).toEqual({
      language: 'de',
      measurementDataType: 'normal',
      parameterGroupId: null,
      stationId: null,
    });
  });

  describe('set parameters', () => {
    beforeEach(() => {
      const appUrlParameter: AppUrlParameter = {
        language: 'en',
        measurementDataType: 'homogenous',
        parameterGroupId: '123',
        stationId: '456',
      };
      const store = TestBed.inject(MockStore);
      store.overrideSelector(selectCurrentAppUrlParameter, appUrlParameter);
      spyOn(document.defaultView!.parent, 'postMessage');
    });

    it('sets language parameter', (done) => {
      service.setLanguage('fr').subscribe(() => {
        expect(document.defaultView?.parent.postMessage).toHaveBeenCalledOnceWith({src: 'lang=fr&mdt=homogenous&pgid=123&sid=456'}, '*');
        done();
      });
    });

    it('sets measurement data type parameter', (done) => {
      service.setMeasurementDataType('normal').subscribe(() => {
        expect(document.defaultView?.parent.postMessage).toHaveBeenCalledOnceWith({src: 'lang=en&mdt=normal&pgid=123&sid=456'}, '*');
        done();
      });
    });

    it('sets parameter group ID parameter', (done) => {
      service.setParameterGroupId('test').subscribe(() => {
        expect(document.defaultView?.parent.postMessage).toHaveBeenCalledOnceWith({src: 'lang=en&mdt=homogenous&pgid=test&sid=456'}, '*');
        done();
      });
    });

    it('sets station ID parameter', (done) => {
      service.setStationId('test').subscribe(() => {
        expect(document.defaultView?.parent.postMessage).toHaveBeenCalledOnceWith({src: 'lang=en&mdt=homogenous&pgid=123&sid=test'}, '*');
        done();
      });
    });

    it('removes an URL parameter', (done) => {
      service.setParameterGroupId(null).subscribe(() => {
        expect(document.defaultView?.parent.postMessage).toHaveBeenCalledWith({src: 'lang=en&mdt=homogenous&sid=456'}, '*');
        done();
      });
    });
  });
});
