import {Component, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {RouterOutlet} from '@angular/router';
import {TranslocoModule, TranslocoService} from '@jsverse/transloco';
import {Store} from '@ngrx/store';
import {collectionActions} from './state/collection/actions/collection.action';
import type {Language} from './shared/models/language';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslocoModule, MatButton, MatButtonToggleGroup, MatButtonToggle],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly translocoService = inject(TranslocoService);
  private readonly store = inject(Store);

  public title = 'meteoschweiz-opendata-explorer';

  public changeLanguage(language: Language): void {
    this.translocoService.setActiveLang(language);
  }

  public testError(): void {
    throw new Error('Test');
  }

  public testCsv(): void {
    this.store.dispatch(collectionActions.loadCollections({collections: ['ch.meteoschweiz.ogd-smn', 'ch.meteoschweiz.ogd-smn-precip']}));
  }
}
