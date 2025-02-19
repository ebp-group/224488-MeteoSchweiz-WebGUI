import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {provideTranslocoScope, TranslocoModule} from '@jsverse/transloco';
import {Subscription, tap} from 'rxjs';
import {routeParamConstants} from '../../../shared/constants/route-param.constants';

@Component({
  selector: 'app-fatal-error',
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './fatal-error.component.html',
  styleUrl: './fatal-error.component.scss',
  providers: [provideTranslocoScope('fatalError')],
})
export class FatalErrorComponent implements OnInit, OnDestroy {
  public errorMessage: string | null = null;

  private readonly subscriptions: Subscription = new Subscription();

  constructor(private readonly route: ActivatedRoute) {}

  public ngOnInit(): void {
    this.subscriptions.add(
      this.route.queryParamMap
        .pipe(
          tap((params) => {
            this.errorMessage = params.get(routeParamConstants.ERROR);
          }),
        )
        .subscribe(),
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  protected forceRefresh(): void {
    window.location.href = '/';
  }
}
