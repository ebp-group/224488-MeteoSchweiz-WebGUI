import {Component, input} from '@angular/core';

@Component({
  selector: 'app-external-link',
  imports: [],
  templateUrl: './external-link.component.html',
  styleUrl: './external-link.component.scss',
})
export class ExternalLinkComponent {
  public readonly href = input.required<string>();
  public readonly text = input<string>();
}
