import {inject, Injectable} from '@angular/core';
import {TranslocoService} from '@jsverse/transloco';
import type {Language} from '../models/language';
import type {TranslatableString} from '../models/translatable-string';

@Injectable({
  providedIn: 'root',
})
export class TranslatableStringService {
  private translocoService = inject(TranslocoService);

  public translate(translatableString: TranslatableString) {
    return translatableString[this.translocoService.getActiveLang() as Language];
  }
}
