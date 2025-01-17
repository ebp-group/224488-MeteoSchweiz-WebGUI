import {TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {provideTransloco} from '@jsverse/transloco';
import {defaultLanguage, supportedLanguages} from './shared/constants/language.constants';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideTransloco({
          config: {
            availableLangs: [...supportedLanguages],
            defaultLang: defaultLanguage,
            reRenderOnLangChange: true,
            prodMode: false,
            missingHandler: {
              logMissingKey: false,
            },
          },
        }),
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'meteoschweiz-opendata-explorer' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('meteoschweiz-opendata-explorer');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[data-test="title"]')?.textContent).not.toBeFalsy();
  });
});
