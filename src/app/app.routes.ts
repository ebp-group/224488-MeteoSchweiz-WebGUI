import {Routes} from '@angular/router';
import {DataSelectionFormComponent} from './data-selection-form/data-selection-form.component';
import {FatalErrorComponent} from './error-handling/components/fatal-error/fatal-error.component';
import {pageConstants} from './shared/constants/page.constant';

export const routes: Routes = [
  {path: pageConstants.MAIN, component: DataSelectionFormComponent, title: 'Open Data Explorer'},
  {path: pageConstants.ERROR, component: FatalErrorComponent, title: 'Error'},
  {path: '**', redirectTo: pageConstants.MAIN, pathMatch: 'full'},
];
