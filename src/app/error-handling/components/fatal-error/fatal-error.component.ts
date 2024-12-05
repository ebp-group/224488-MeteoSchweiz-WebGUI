import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription, tap} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {RouteParamConstants} from '../../../shared/constants/route-param.constants';

@Component({
  selector: 'app-fatal-error',
  standalone: true,
  imports: [],
  templateUrl: './fatal-error.component.html',
  styleUrl: './fatal-error.component.scss',
})
export class FatalErrorComponent implements OnInit, OnDestroy {
  public errorMessage: string | null = null;

  private readonly subscriptions: Subscription = new Subscription();

  constructor(private readonly route: ActivatedRoute) {}

  public ngOnInit() {
    this.subscriptions.add(
      this.route.queryParamMap
        .pipe(
          tap((params) => {
            this.errorMessage = params.get(RouteParamConstants.ERROR);
          }),
        )
        .subscribe(),
    );
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  protected forceRefresh() {
    window.location.href = '/';
  }
}