import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {TranslocoModule, TranslocoService} from '@jsverse/transloco';
import {type Language} from './shared/types/language.types';
import {StacService} from './stac/stac.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslocoModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly translocoService = inject(TranslocoService);
  private readonly stacService = inject(StacService);

  public title = 'meteoschweiz-opendata-explorer';

  public changeLanguage(language: Language): void {
    this.translocoService.setActiveLang(language);
  }

  public testError(): void {
    throw new Error('Test');
  }

  public testStac(): void {
    this.stacService.fetchAll();
  }
}
