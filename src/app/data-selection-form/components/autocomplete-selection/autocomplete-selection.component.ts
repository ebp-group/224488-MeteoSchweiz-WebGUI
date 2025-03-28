import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {concatLatestFrom} from '@ngrx/operators';
import {combineLatestWith, map, Observable, startWith, Subscription, tap} from 'rxjs';
import {LocalizedDisplayItem} from '../../../shared/models/localized-display-item';

@Component({
  template: '',
})
export abstract class AutocompleteSelectionComponent<T extends LocalizedDisplayItem> implements OnInit, OnDestroy {
  protected abstract readonly selectedValue$: Observable<string | null>;
  protected abstract readonly allValueObjects$: Observable<T[]>;

  protected filteredValueObjects$?: Observable<T[]>;
  protected readonly formControl = new FormControl<string | T>('');
  protected readonly subscriptions = new Subscription();

  public ngOnInit(): void {
    const valueChanges$ = this.formControl.valueChanges.pipe(
      startWith(''),
      concatLatestFrom(() => this.selectedValue$),
      tap(([value, selectedValue]) => this.handleValueChange(value, selectedValue)),
      map(([value]): string => this.convertValueToString(value)),
    );
    this.filteredValueObjects$ = this.allValueObjects$.pipe(
      combineLatestWith(valueChanges$),
      concatLatestFrom(() => this.selectedValue$),
      map(([[valueObjects, value], selectedValue]) => this.filterObjects(valueObjects, value, selectedValue)),
    );
    this.subscriptions.add(
      this.selectedValue$
        .pipe(
          concatLatestFrom(() => this.allValueObjects$),
          map(([value, valueObjects]) => this.findObject(value, valueObjects)),
          tap((valueObject) => this.formControl.patchValue(valueObject)),
        )
        .subscribe(),
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  protected abstract filterObjects(valueObjects: T[], filterValue: string, selectedValue: string | null): T[];

  protected abstract dispatchValueChange(valueId: string | null): void;

  protected displayValueObjectName(valueObject: T | null): string {
    return valueObject?.displayName ?? '';
  }

  protected findObject(value: string | null, valueObjects: T[]): T | null {
    if (value === null) {
      return null;
    }
    return valueObjects.find((object) => object.id === value) ?? null;
  }

  protected clearInput(): void {
    this.formControl.reset();
  }

  private handleValueChange(value: string | T | null, selectedValue: string | null): void {
    const valueIdOrNull = value === null || typeof value === 'string' ? null : value.id;
    if (valueIdOrNull !== selectedValue) {
      this.dispatchValueChange(valueIdOrNull);
    }
  }

  private convertValueToString(value: string | T | null): string {
    return typeof value === 'string' ? value : this.displayValueObjectName(value);
  }
}
