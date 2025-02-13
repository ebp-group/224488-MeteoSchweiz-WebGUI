import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {TranslocoModule, TranslocoService} from '@jsverse/transloco';
import {ParameterService} from './stac/service/parameter.service';
import type {Language} from './shared/models/language';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslocoModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly translocoService = inject(TranslocoService);
  private readonly parameterService = inject(ParameterService);

  public title = 'meteoschweiz-opendata-explorer';

  public changeLanguage(language: Language): void {
    this.translocoService.setActiveLang(language);
  }

  public testError(): void {
    throw new Error('Test');
  }

  public async testCsv(): Promise<void> {
    const paramsA1 = await this.parameterService.getParametersForCollection('ch.meteoschweiz.ogd-smn');
    console.log(paramsA1);
    const paramsA2 = await this.parameterService.getParametersForCollection('ch.meteoschweiz.ogd-smn-precip');
    console.log(paramsA2);
  }
}
