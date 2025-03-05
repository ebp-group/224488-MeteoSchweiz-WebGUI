import {TestBed} from '@angular/core/testing';
import {TranslocoService} from '@jsverse/transloco';
import {Action} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {appActions} from '../actions/app.actions';
import {setLanguage} from './app.effects';

describe('AppEffects', () => {
  let actions$: Observable<Action>;

  beforeEach(() => {
    actions$ = new Observable<Action>();
    TestBed.configureTestingModule({
      providers: [{provide: TranslocoService, useValue: {setActiveLang: (): void => {}}}],
    });
  });

  it('should set the given language within the translation service when appActions.setLanguage is dispatched', (done: DoneFn) => {
    const translocoService = TestBed.inject(TranslocoService);
    spyOn(translocoService, 'setActiveLang');
    actions$ = of(appActions.setLanguage({language: 'en'}));

    setLanguage(actions$, translocoService).subscribe(() => {
      expect(translocoService.setActiveLang).toHaveBeenCalledOnceWith('en');
      done();
    });
  });
});
