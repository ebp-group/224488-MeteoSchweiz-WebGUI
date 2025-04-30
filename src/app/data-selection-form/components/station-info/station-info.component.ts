import {AsyncPipe} from '@angular/common';
import {Component, inject, input} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MatList, MatListItem} from '@angular/material/list';
import {TranslocoDirective} from '@jsverse/transloco';
import {Store} from '@ngrx/store';
import {ExternalLinkComponent} from '../../../shared/components/external-link/external-link.component';
import {StationWithParameterGroups} from '../../../shared/models/station-with-parameter-groups';
import {IconFromConfigPipe} from '../../../shared/pipes/icon-from-config.pipe';
import {TranslatableStringPipe} from '../../../shared/pipes/translatable-string.pipe';
import {appFeature} from '../../../state/app/reducers/app.reducer';

@Component({
  selector: 'app-station-info',
  imports: [
    IconFromConfigPipe,
    MatIcon,
    MatList,
    MatListItem,
    TranslatableStringPipe,
    AsyncPipe,
    TranslocoDirective,
    ExternalLinkComponent,
  ],
  templateUrl: './station-info.component.html',
  styleUrl: './station-info.component.scss',
})
export class StationInfoComponent {
  private readonly store = inject(Store);

  public readonly station = input.required<StationWithParameterGroups>();

  protected readonly currentLanguage$ = this.store.select(appFeature.selectLanguage);
}
