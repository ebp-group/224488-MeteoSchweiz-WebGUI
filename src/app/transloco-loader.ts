import {inject, Injectable} from '@angular/core';
import {Translation, TranslocoLoader} from '@jsverse/transloco';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {type Language} from './shared/types/language.types';

@Injectable({providedIn: 'root'})
export class TranslocoHttpLoader implements TranslocoLoader {
  private readonly http = inject(HttpClient);

  public getTranslation(language: Language): Observable<Translation> {
    return this.http.get<Translation>(`/i18n/${language}.json`);
  }
}
