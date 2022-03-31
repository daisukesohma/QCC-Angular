import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { EventService } from './event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { Subscription } from 'rxjs';
import { SharedComponent } from 'src/app/shared/shared.component';


@Component({
  selector: 'qcc-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit, OnDestroy {
  @ViewChild('eventsRef', { static: false }) eventsRef: ElementRef;
  @ViewChild('cricketRef', { static: false }) cricketRef: ElementRef;
  @ViewChild('aflRef', { static: false }) aflRef: ElementRef;
  aflData: any = [];
  currentYear = new Date().getFullYear();
  userDataSub: Subscription;
  bannerTextName: string;
  bannerSubTextName: string;
  fixtureLists: any = {};
  cricketData: any = [];
  eventsId: any;
  upCommingEventsData: any = [];
  userData: any = {};
  userLoggedIn: boolean = false;
  customOptions: OwlOptions = {
    items: 5,
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    autoWidth: true,
    autoplay: false,
    autoplayHoverPause: true,
    dots: true,
    navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
    responsive: {
      0: {
        items: 1,
        nav: false,
        autoplay: false,
      },
      400: {
        items: 1,
        nav: false,
        autoplay: false,
      },
      500: {
        items: 2,
      },
      740: {
        items: 3,
      },
    },
    nav: true
  };
  aflHomeTeam: any;
  cricketHomeTeam: any;

  constructor(
    public eventService: EventService,
    public appService: AppService,
    public router: Router,
    public route: ActivatedRoute) {
    this.eventsId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    sessionStorage.clear();
    this.broadcastUserData();
    this.checkUserLogin();
    this.fixtureLists = this.eventService.userDetails ? this.eventService.userDetails.adminConfig : {};
    this.getFixtureData();
    this.getUpCommingEventsList();
    this.bannerTextName = this.fixtureLists.adminConfig ? this.fixtureLists.adminConfig.bannerHeading : '';
    this.bannerSubTextName = this.fixtureLists.adminConfig ? this.fixtureLists.adminConfig.bannerSubHeading : '';
  }

  ngOnDestroy() {
    this.userDataSub.unsubscribe();
  }

  checkUserLogin() {
    if (this.eventService.userDetails && this.eventService.userDetails.memberCategory) {
      this.userLoggedIn = true;
    } else {
      this.userLoggedIn = false;
    }
    this.userDataSub = this.appService.userSourceState$.subscribe((data: any) => {
      if (data.memberCategory) {
        this.userLoggedIn = true;
      } else {
        this.userLoggedIn = false;
      }
    });
  }

  /**
   * broadcasted user data
   */
  broadcastUserData() {
    this.userDataSub = this.appService.userSourceState$.subscribe((data: any) => {
      this.userData = data.adminConfig;
      this.fixtureLists = data.adminConfig;
      this.bannerTextName = data.adminConfig ? data.adminConfig.bannerHeading : '';
      this.bannerSubTextName = data.adminConfig ? data.adminConfig.bannerSubHeading : '';
      this.getFixtureData();
    });
  }

  /**
   * get Fixture lists for tables
   */
  getFixtureData() {
    if (this.fixtureLists.aflSeason) {
      this.getAfls('afl');
    }
    if (this.fixtureLists.cricketSeason) {
      this.getAfls('cricket');
    }
  }

  getAfls(eventType): void {
    this.eventService.getAfl(eventType).subscribe((response) => {
      const eventData = response.data;
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < eventData.length; i++) {
        eventData[i].startDay = this.upCommingDay(eventData[i].startDate);
      }
      if (eventType === 'afl') {
        this.aflData = this.getHomeTeam(eventType, eventData);
      } else {
        this.cricketData = eventData;
        for (let cric of eventData) {
          if (cric.dayTwo) {
            const remainingSeats = cric.dayOne.remainingSeats + cric.dayTwo.remainingSeats + cric.dayThree.remainingSeats + cric.dayFour.remainingSeats + cric.dayFive.remainingSeats;
            cric['testMatchTotalRemainingSeats'] = remainingSeats;
          }
        }
      }
    }, (error) => {
    });
  }

  getUpCommingEventsList(): void {
    this.eventService.getUpcommingEvent().subscribe((response) => {
      const upCommingEventsData = response.data;
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < upCommingEventsData.length; i++) {
        upCommingEventsData[i].startDate = this.date(upCommingEventsData[i].startDate);
      }
      this.upCommingEventsData = upCommingEventsData;
    }, (error) => {
    });
  }

  date(startDate) {
    const a = startDate.split('/');
    const b = `${a[2]}/${a[1]}/${a[0]}`;
    const c = new Date(b);

    return c;
  }
  upCommingDay(startDate) {
    const a = startDate.split('/');
    const b = `${a[2]}/${a[1]}/${a[0]}`;
    const c = new Date(b);
    const d = c.getDay();
    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const e = weekDays[d];
    return e;
  }

  /**
   * get home team from afl or cricket list
   * @param eventType whether AFL or Cricket
   * @param list Array
   */
  getHomeTeam(eventType, eventList) {
    for (const data of eventList) {
      if (data.firstTeam.homeTeam) {
        if (eventType === 'afl') {
          this.aflHomeTeam = data.firstTeam;
        } else {
          this.cricketHomeTeam = data.firstTeam;
        }
        delete data.firsTeam;
      } else {
        if (eventType === 'afl') {
          this.aflHomeTeam = data.secondTeam;
        } else {
          this.cricketHomeTeam = data.secondTeam;
        }
        delete data.secondTeam;
      }
    }
    return eventList;
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
}
