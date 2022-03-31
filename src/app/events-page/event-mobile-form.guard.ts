import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class EventMobileFormGuard implements CanActivate {
  constructor(public router: Router) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (next.url.length > 1 && !sessionStorage.getItem('clubEvents') && !sessionStorage.getItem('stadiumEvents')) {
      this.router.navigate(['/event-booking/mobile']);
    } else {
      return true;
    }
  }
}
