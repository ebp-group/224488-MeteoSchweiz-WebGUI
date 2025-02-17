import {Component, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {TranslocoModule, TranslocoService} from '@jsverse/transloco';
import {Store} from '@ngrx/store';
import {collectionActions} from '../state/collection/actions/collection.action';
import {ParameterListComponent} from './components/parameter-list/parameter-list.component';
import type {Language} from '../shared/models/language';

@Component({
  selector: 'app-data-selection-form',
  standalone: true,
  imports: [TranslocoModule, MatButton, MatButtonToggleGroup, MatButtonToggle, ParameterListComponent],
  templateUrl: './data-selection-form.component.html',
  styleUrl: './data-selection-form.component.scss',
})
export class DataSelectionFormComponent {
  private readonly translocoService = inject(TranslocoService);
  private readonly store = inject(Store);

  protected changeLanguage(language: Language): void {
    this.translocoService.setActiveLang(language);
  }

  protected testError(): void {
    throw new Error('Test');
  }

  protected testCsv(): void {
    this.store.dispatch(collectionActions.loadCollections({collections: ['ch.meteoschweiz.ogd-smn', 'ch.meteoschweiz.ogd-smn-precip']}));
  }
}
