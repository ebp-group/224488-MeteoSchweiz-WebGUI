import {TestBed} from '@angular/core/testing';
import {TranslocoService} from '@jsverse/transloco';
import {Action} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {AppUrlParameter} from '../../../shared/models/app-url-parameter';
import {appActions} from '../actions/app.actions';
import {initializeLanguage, setLanguage, setLanguageInUrl} from './app.effects';

describe('AppEffects', () => {
  let actions$: Observable<Action>;

  beforeEach(() => {
    actions$ = new Observable<Action>();
    TestBed.configureTestingModule({
      providers: [{provide: TranslocoService, useValue: jasmine.createSpyObj('TranslocoService', ['setActiveLang'])}],
    });
  });

  it('should set the given language within the translation service when appActions.setLanguage is dispatched', (done: DoneFn) => {
    const translocoService = TestBed.inject(TranslocoService);
    actions$ = of(appActions.setLanguage({language: 'en'}));

    setLanguage(actions$, translocoService).subscribe(() => {
      expect(translocoService.setActiveLang).toHaveBeenCalledOnceWith('en');
      done();
    });
  });

  it('should dispatch setLanguage action when appActions.initializeApp is dispatched', (done: DoneFn) => {
    actions$ = of(appActions.initializeApp({parameter: {language: 'fr'} as AppUrlParameter}));
    initializeLanguage(actions$).subscribe((action) => {
      expect(action).toEqual(appActions.setLanguage({language: 'fr'}));
      done();
    });
  });

  it('should call the urlParameterService when appActions.setLanguage is dispatched', (done: DoneFn) => {
    const urlParameterService = jasmine.createSpyObj('UrlParameterService', ['setLanguage']);
    urlParameterService.setLanguage.and.returnValue(of(undefined));
    actions$ = of(appActions.setLanguage({language: 'en'}));
    setLanguageInUrl(actions$, urlParameterService).subscribe(() => {
      expect(urlParameterService.setLanguage).toHaveBeenCalledOnceWith('en');
      done();
    });
  });
});
