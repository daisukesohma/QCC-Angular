import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppService } from '../app.service';
import { Router } from '@angular/router';

@Injectable()
export class ShareService {

  constructor(
    private http: HttpClient,
    public router: Router,
    public appService: AppService) {
  }

  get(url) {
    return this.http.get(url);
  }

  post(url, data) {
    return this.http.post(url, data);
  }

  put(url, data) {
    return this.http.put(url, data);
  }

  sheet(url) {
    return this.http.get(url);
  }
  /**
   * interceptor
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = localStorage.getItem('userToken') ? `Bearer ${localStorage.getItem('userToken')}` : '';
    if (authToken != null && !this.router.routerState.snapshot.url.includes('googleSheet')) {
      req = req.clone({
        setHeaders: {
          Accept: 'application/json',
          Authorization: authToken
        }
      });
    }
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401 && this.router.routerState.snapshot.url !== '/login') {
          this.appService.showLoader(false);
          localStorage.clear();
          this.router.navigate(['/login']);
        } else {
          return throwError(err);
        }
      })
    );
  }
}
