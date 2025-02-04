import {inject, Injectable} from '@angular/core';
import {TranslocoService} from '@jsverse/transloco';
import {TranslatableString} from '../types/translatable-string.types';
import {Language} from '../types/language.types';

@Injectable({
  providedIn: 'root',
})
export class TranslatableStringService {
  private translocoService = inject(TranslocoService);

  public translate(translatableString: TranslatableString) {
    return translatableString[this.translocoService.getActiveLang() as Language];
  }
}
