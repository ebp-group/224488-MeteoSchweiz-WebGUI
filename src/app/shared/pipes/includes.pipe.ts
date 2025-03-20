import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'includes',
  standalone: true,
})
export class IncludesPipe implements PipeTransform {
  public transform<
    ContainerType extends
      | string
      | {includes(searchValue: ArgumentType): boolean}
      | {has(searchValue: ArgumentType): boolean}
      | null
      | undefined,
    ArgumentType,
  >(container: ContainerType, searchValue: ArgumentType): boolean {
    if (typeof container === 'string') {
      return typeof searchValue === 'string' ? container.includes(searchValue) : false;
    }
    if (typeof container === 'object' && container != null) {
      if ('includes' in container && typeof container.includes === 'function') {
        return container.includes(searchValue);
      }
      if ('has' in container && typeof container.has === 'function') {
        return container.has(searchValue);
      }
    }
    return false;
  }
}
