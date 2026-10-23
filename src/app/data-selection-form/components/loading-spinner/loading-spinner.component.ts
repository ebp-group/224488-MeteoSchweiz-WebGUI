import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner',
  imports: [MatProgressSpinnerModule],
  templateUrl: './loading-spinner.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './loading-spinner.component.scss',
})
export class LoadingSpinnerComponent {}
