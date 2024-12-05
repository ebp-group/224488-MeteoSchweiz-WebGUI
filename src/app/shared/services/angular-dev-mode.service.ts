import {Injectable, isDevMode} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AngularDevModeService {
  public isDevMode(): boolean {
    return isDevMode();
  }
}
