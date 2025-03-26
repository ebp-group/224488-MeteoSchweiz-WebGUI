import {AsyncPipe, DatePipe} from '@angular/common';
import {Component, inject} from '@angular/core';
import {TranslocoModule} from '@jsverse/transloco';
import {Store} from '@ngrx/store';
import {TranslatableStringPipe} from '../../../shared/pipes/translatable-string.pipe';
import {appFeature} from '../../../state/app/reducers/app.reducer';
import {formFeature} from '../../../state/form/reducers/form.reducer';
import {selectSelectedStationForCollection} from '../../../state/form/selectors/form.selector';

@Component({
  selector: 'app-selection-review',
  imports: [TranslocoModule, AsyncPipe, DatePipe, TranslatableStringPipe],
  templateUrl: './selection-review.component.html',
  styleUrl: './selection-review.component.scss',
})
export class SelectionReviewComponent {
  private readonly store = inject(Store);

  protected readonly currentLanguage$ = this.store.select(appFeature.selectLanguage);
  protected readonly selectedDataInterval$ = this.store.select(formFeature.selectSelectedDataInterval);
  protected readonly selectedTimeRange$ = this.store.select(formFeature.selectSelectedTimeRange);
  protected readonly selectedHistoricalDateRange$ = this.store.select(formFeature.selectSelectedHistoricalDateRange);
  protected readonly selectedStation$ = this.store.select(selectSelectedStationForCollection);
}
