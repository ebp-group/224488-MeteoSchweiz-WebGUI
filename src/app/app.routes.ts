import {Routes} from '@angular/router';
import {FatalErrorComponent} from './error-handling/components/fatal-error/fatal-error.component';
import {Page} from './shared/enums/page.enum';

// TODO: multi language
const siteOperator = 'MeteoSchweiz';
export const routes: Routes = [
  // TODO: multi language
  {path: Page.Error, component: FatalErrorComponent, title: `Fehler ${siteOperator}`},
];
