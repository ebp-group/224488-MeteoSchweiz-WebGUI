import {Component, input} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'app-step-label',
  imports: [MatIcon, MatTooltip],
  templateUrl: './step-label.component.html',
  styleUrl: './step-label.component.scss',
})
export class StepLabelComponent {
  public readonly title = input.required<string>();
  public readonly description = input<string>();
  public readonly descriptionInfoTooltip = input<string>();
  public readonly currentValue = input<string | null>();
}
