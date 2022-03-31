import { Component, OnInit } from '@angular/core';
import { EventService } from '../events/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { AppService } from 'src/app/app.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'qcc-events-detail',
  templateUrl: './events-detail.component.html',
  styleUrls: ['./events-detail.component.css']
})
export class EventsDetailComponent implements OnInit {
  upCommingEventsData: any = [];
  eventsId: any;
  navbarOpen = false;
  user: any;
  isIn: any;
  userDataSub: Subscription;
  userData: any = {};

  constructor(
    private authService: AuthService,
    public eventService: EventService,
    public appService: AppService,
    public router: Router,
    private route: ActivatedRoute) {
    this.eventsId = this.route.snapshot.paramMap.get('id');
    this.user = localStorage.getItem('currentUser');
    this.appService.showLoader(true);
  }

  ngOnInit() {
    this.broadcastUserData();
    this.eventDetailsPage();
    sessionStorage.clear();
  }

  ngOnDestroy() {
    this.userDataSub.unsubscribe();
  }

  /**
   * broadcasted user data
   */
  broadcastUserData() {
    this.userDataSub = this.appService.userSourceState$.subscribe((data: any) => {
      this.userData = data.adminConfig;
    });
  }

  getUpdatedEventId(event) {
    this.appService.showLoader(true);
    this.eventsId = event;
    this.eventDetailsPage();
  }

  eventDetailsPage(): void {
    this.eventService.detailUpcommingEvents(this.eventsId).subscribe((response) => {
      const upCommingEventsData = response.data;
      upCommingEventsData.startDate = this.date(upCommingEventsData.startDate);
      this.upCommingEventsData = upCommingEventsData;
      this.appService.showLoader(false);
    }, (error) => {
      this.appService.showLoader(false);
    });
  }

  date(startDate) {
    const a = startDate.split('/');
    const b = `${a[2]}/${a[1]}/${a[0]}`;
    const c = new Date(b);
    return c;
  }

  toggleState() {
    const bool = this.isIn;
    this.isIn = bool === false ? true : false;
  }

  redirectMobileOrWeb(data) {
    if (!localStorage.hasOwnProperty('userToken')) {
      this.router.navigate(['/login']);
    } else if (window.innerWidth < 768) {
      this.router.navigate([`event-booking/tickets/mobile/stadium/${data.id}`]);
    } else {
      this.router.navigate([`/stadium-event/${data.id}`]);
    }
  }

  logout() {
    this.authService.logoutUser().subscribe((response: any) => {
      localStorage.clear();
      sessionStorage.clear();
      this.router.navigate(['/login']);
    });
  }
}

