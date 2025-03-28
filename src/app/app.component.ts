import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {IconService} from './shared/services/icon.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly iconsService = inject(IconService);

  constructor() {
    this.iconsService.initIcons();
  }
}
