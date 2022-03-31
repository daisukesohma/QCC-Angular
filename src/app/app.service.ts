import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable()
export class AppService {

  // Common loader
  loaderSource = new Subject<any>();
  loaderState$ = this.loaderSource.asObservable();

  // stadium Event access
  eventSource = new Subject<any>();
  eventState$ = this.eventSource.asObservable();

  // Common loader
  userSource = new Subject<any>();
  userSourceState$ = this.userSource.asObservable();

  // Common toast
  messageSource = new Subject<any>();
  currentMessage$ = this.messageSource.asObservable();

  constructor() { }

  /**
   * For show hide main loader
   * @param loading loader value to be broadcasted
   */
  showLoader(loading: boolean) {
    this.loaderSource.next(loading);
  }

  /**
   * To show Membership on
   */
  userDetail(userDetail) {
    this.userSource.next(userDetail);
  }

  /**
   * To Select or unselect Stadium Events
   * @param eventAccess Access for stadium events
   */
  accessStadium(stadiumEvent) {
    this.eventSource.next(stadiumEvent);
  }

  changeToastMessage(message) {
    this.messageSource.next(message);
  }
}
