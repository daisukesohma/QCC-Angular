import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class AuthEventsPageGuard implements CanActivate {
  constructor(public router: Router, public activatedRoute: ActivatedRoute) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!localStorage.hasOwnProperty('userToken')) {
      this.router.navigate(['/login']);
    } else if (window.innerWidth < 768) {
      this.router.navigate(['/event-booking/mobile']);
    } else {
      return true;
    }
  }
}
