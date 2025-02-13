import {Location} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Translation, TranslocoLoader} from '@jsverse/transloco';
import {Observable} from 'rxjs';
import type {Language} from './shared/models/language';

@Injectable({providedIn: 'root'})
export class TranslocoHttpLoader implements TranslocoLoader {
  private readonly http = inject(HttpClient);
  private readonly location = inject(Location);

  public getTranslation(language: Language): Observable<Translation> {
    return this.http.get<Translation>(this.location.prepareExternalUrl(`/i18n/${language}.json`));
  }
}
