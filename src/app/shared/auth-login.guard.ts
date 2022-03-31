import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EventService } from '../events-page/events/event.service';

@Injectable()
export class AuthLoginGuard implements CanActivate {

  constructor(public eventService: EventService, public router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isPageRefresh()) {
      const isConfirm = confirm('Are You sure want to reload the page?');
      if (isConfirm) {
        this.router.navigate(['/stadium-event']);
        return (false);
      } else {
        this.router.navigated = true;
        this.router.navigate(['/order-details']);
        return (true);
      }
    } else {
      return (true);
    }
  }

  private isPageRefresh(): boolean {
    return (!this.router.navigated);
  }
}
