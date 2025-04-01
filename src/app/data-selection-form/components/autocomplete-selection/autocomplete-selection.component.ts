import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {concatLatestFrom} from '@ngrx/operators';
import {combineLatestWith, map, Observable, startWith, Subscription, tap} from 'rxjs';
import {DisplayItem} from '../../../shared/models/display-item';

@Component({
  template: '',
})
export abstract class AutocompleteSelectionComponent<T extends DisplayItem> implements OnInit, OnDestroy {
  protected abstract readonly selectedId$: Observable<string | null>;
  protected abstract readonly allDisplayItems$: Observable<T[]>;

  protected filteredDisplayItems$?: Observable<T[]>;
  protected readonly formControl = new FormControl<string | T>('');
  protected readonly subscriptions = new Subscription();

  public ngOnInit(): void {
    const valueChanges$ = this.formControl.valueChanges.pipe(
      startWith(''),
      concatLatestFrom(() => this.selectedId$),
      tap(([value, selectedId]) => this.handleValueChange(value, selectedId)),
      map(([value]): string => this.convertValueToString(value)),
    );
    this.filteredDisplayItems$ = this.allDisplayItems$.pipe(
      combineLatestWith(valueChanges$),
      concatLatestFrom(() => this.selectedId$),
      map(([[allDisplayItems, value], selectedId]) => this.filterDisplayItems(allDisplayItems, value, selectedId)),
    );
    this.subscriptions.add(
      this.selectedId$
        .pipe(
          concatLatestFrom(() => this.allDisplayItems$),
          map(([selectedId, allDisplayItems]) => this.findDisplayItem(selectedId, allDisplayItems)),
          tap((displayItem) => this.formControl.setValue(displayItem)),
        )
        .subscribe(),
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  protected abstract filterDisplayItems(allDisplayItems: T[], filterValue: string, selectedId: string | null): T[];

  protected abstract dispatchValueChange(id: string | null): void;

  protected getDisplayItemName(displayItem: T | null): string {
    return displayItem?.displayName ?? '';
  }

  protected findDisplayItem(id: string | null, allDisplayItems: T[]): T | null {
    if (id === null) {
      return null;
    }
    return allDisplayItems.find((item) => item.id === id) ?? null;
  }

  protected clearInput(): void {
    this.formControl.reset();
  }

  private handleValueChange(value: string | T | null, selectedId: string | null): void {
    const id = value === null || typeof value === 'string' ? null : value.id;
    if (id !== selectedId) {
      this.dispatchValueChange(id);
    }
  }

  private convertValueToString(value: string | T | null): string {
    return typeof value === 'string' ? value : this.getDisplayItemName(value);
  }
}
