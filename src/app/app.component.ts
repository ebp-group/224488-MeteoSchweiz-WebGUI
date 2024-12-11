import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {TranslocoModule, TranslocoService} from '@jsverse/transloco';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslocoModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private translocoService = inject(TranslocoService);
  protected title = 'meteoschweiz-opendata-explorer';

  public changeLanguage(lang: string) {
    this.translocoService.setActiveLang(lang);
  }

  public testError() {
    throw new Error('Test');
  }
}
