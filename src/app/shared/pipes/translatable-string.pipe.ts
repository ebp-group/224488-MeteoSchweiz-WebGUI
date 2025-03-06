import {Pipe, PipeTransform} from '@angular/core';
import {Language} from '../models/language';
import {TranslatableString} from '../models/translatable-string';

@Pipe({
  name: 'translatableString',
  standalone: true,
})
export class TranslatableStringPipe implements PipeTransform {
  public transform(value: string | TranslatableString, language: Language): string {
    return typeof value === 'string' ? value : value[language];
  }
}
