import {Pipe, PipeTransform} from '@angular/core';
import {emptyIcon, iconsConfig} from '../configs/icons.config';

@Pipe({
  name: 'iconFromConfig',
})
export class IconFromConfigPipe implements PipeTransform {
  public transform(value: string | undefined): string {
    if (!value) {
      return emptyIcon.id;
    }
    return iconsConfig.find((icon) => icon.id === value.toLowerCase())?.id ?? emptyIcon.id;
  }
}
