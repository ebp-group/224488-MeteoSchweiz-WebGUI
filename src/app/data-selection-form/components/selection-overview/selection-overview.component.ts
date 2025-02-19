import {Component} from '@angular/core';
import {TranslocoModule} from '@jsverse/transloco';

@Component({
  selector: 'app-selection-overview',
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './selection-overview.component.html',
  styleUrl: './selection-overview.component.scss',
})
export class SelectionOverviewComponent {}
