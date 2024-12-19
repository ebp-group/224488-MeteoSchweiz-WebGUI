import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {TranslocoModule, TranslocoService} from '@jsverse/transloco';
import {LanguageIdentifier} from './shared/types/languages.types';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslocoModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly translocoService = inject(TranslocoService);

  protected title = 'meteoschweiz-opendata-explorer';

  public changeLanguage(language: string): void {
    this.translocoService.setActiveLang(language);
  }

  public testError(): void {
    throw new Error('Test');
  }
}
