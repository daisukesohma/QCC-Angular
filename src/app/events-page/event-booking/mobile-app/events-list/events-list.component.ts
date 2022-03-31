import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { EventBookingService } from '../../event-booking.service';
import { AppService } from './../../../../app.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs/ngx-bootstrap-tabs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'qcc-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.css']
})
export class EventsListComponent implements OnInit {
  userDisplayName = '';
  userDisplaylastName = '';
  userMmembershipName = '';
  firstCharacter: string;
  lastCharacter: string;
  clubEventsList: any[] = [];
  stadiumEventsList: any[] = [];
  memberShipExpired = false;
  display = false;
  memberShipName = '';
  stadium: any;
  eventId: number;
  @ViewChild('tabset', { static: false }) tabset: TabsetComponent;
  @ViewChild('insideElement', { static: false }) insideElement: any;
  @ViewChild('openbtn', { static: false }) openbtn: any;
  noEventsData: boolean = false;
  sideNavOpen: boolean = false;
  loading: boolean;

  constructor(
    public appService: AppService,
    public router: Router,
    public authService: AuthService,
    public atcivatedRoute: ActivatedRoute,
    public bookingService: EventBookingService,
  ) {
  }

  ngOnInit() {
    this.userDisplayName = localStorage.getItem('loggedUser');
    this.userDisplaylastName = localStorage.getItem('user');
    this.userMmembershipName = localStorage.getItem('userMembership');
    if (this.userDisplayName && this.userDisplaylastName) {
      this.firstCharacter = this.userDisplayName.substring(0, 1).toUpperCase();
      this.lastCharacter = this.userDisplaylastName.substring(0, 1).toUpperCase();
    }
    this.atcivatedRoute.paramMap.subscribe((params) =>
      this.eventId = +params.get('id'),
    );
    this.getStadiumEvents();
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {
    if (window.innerWidth <= 768) {
      const clickedInside = this.insideElement.nativeElement.contains(targetElement);
      if (!clickedInside) {
        this.sideNavOpen = false;
      }
    }
  }

  openNav() {
    this.sideNavOpen = true;
  }

  closeNav() {
    this.sideNavOpen = false;
  }

  // getClubEvents() {
  //   this.bookingService.getClubEvents().subscribe((response: any) => {
  //     this.loading = false;
  //     this.memberShipName = response.data.memberCategory.name;                                                                                                                                               
  //     this.stadium = response.data.memberCategory.stadiumSeats;
  //     this.validateMembershipExpired(response.data.memberCategory.membershipExiryDate);
  //     this.clubEventsList = response.data.events;
  //     for (const data of this.clubEventsList) {
  //       data.eventName = data.name;
  //       data.totalMemberTickets = 0;
  //       data.totalGuestTickets = 0;
  //       data.restaurantTickets = 0;
  //       data.totalChildTickets = 0;
  //       data.memberTicketPrice = data.memberTicketPrice ? data.memberTicketPrice : 0;
  //       data.guestTicketPrice = data.guestTicketPrice ? data.guestTicketPrice : 0;
  //       data.childTicketPrice = data.childTicketPrice ? data.childTicketPrice : 0;
  //       data.diningTicketPrice = data.diningTicketPrice ? data.diningTicketPrice : 0;
  //     }
  //     if (!sessionStorage.hasOwnProperty('clubEvents')) {
  //       sessionStorage.setItem('clubEvents', JSON.stringify(this.clubEventsList));
  //     }
  //     if (!sessionStorage.hasOwnProperty('stadium')) {
  //       sessionStorage.setItem('stadium', this.stadium);
  //     }
  //   }, (error) => {
  //     this.loading = false;
  //   });
  // }

  getStadiumEvents() {
    this.loading = true;
    this.bookingService.getStadiumEvents(this.eventId).subscribe((response: any) => {
      sessionStorage.setItem('memberShipName', response.data.memberCategory.name);
      sessionStorage.setItem('familyLinking', response.data.memberCategory.familyLinking);
      if (response.data.events) {
        this.stadiumEventsList = response.data.events;
        for (const data of this.stadiumEventsList) {
          data.eventName = data.name;
          data.totalMemberTickets = data.purchasedMemberTickets ? data.purchasedMemberTickets : 0;
          data.totalGuestTickets = data.purchasedGuestTickets ? data.purchasedGuestTickets : 0;
          data.restaurantTickets = data.purchasedDininigTickets ? data.purchasedDininigTickets : 0;
          data.totalChildTickets = data.purchasedChildTickets ? data.purchasedChildTickets : 0;
          data.complementary = data.purchasedComplimentryTickets ? data.purchasedComplimentryTickets : 0;
          data.familyLinking = data.linkedFamilyMemberNo ? data.linkedFamilyMemberNo : [];
          data.memberTicketPrice = data.memberTicketPrice ? data.memberTicketPrice : 0;
          data.guestTicketPrice = data.guestTicketPrice ? data.guestTicketPrice : 0;
          data.childTicketPrice = data.childTicketPrice ? data.childTicketPrice : 0;
          data.diningTicketPrice = data.diningTicketPrice ? data.diningTicketPrice : 0;
        }
      } else {
        this.noEventsData = true;
      }
      this.loading = false;
    }, (error) => {
      this.loading = false;
    });
  }

  /**
   * validate membership expired or not
   * @param expiryDate expired Date
   */
  validateMembershipExpired(expiryDate) {
    expiryDate = expiryDate.split('/');
    const expireDate = `${expiryDate[1]}/${expiryDate[0]}/${expiryDate[2]}`;
    const currentDate = new Date();
    if (currentDate.getTime() > new Date(expireDate).getTime()) {
      this.memberShipExpired = true;
      sessionStorage.clear();
    }
  }

  tabChange(event) {
    if (event.heading === 'Stadium Events' && !this.stadium) {
      this.display = true;
      setTimeout(() => {
        this.tabset.tabs[0].active = true;
      });
    }
  }

  downloadEventDoc(event) {
    window.open(event.pdfUrl, '_blank');
  }

  menuTabChange(tabId) {
    this.tabset.tabs[tabId].active = true;
  }

  logout() {
    this.loading = true;
    this.authService.logoutUser().subscribe((response: any) => {
      localStorage.clear();
      sessionStorage.clear();
      this.router.navigate(['/login']);
      this.loading = false;
    }, (error) => {
      this.loading = false;
    });
  }

  openTicketPage(event) {
    if (event.day) {
      this.router.navigate(['/event-booking/tickets/mobile/stadium', event.id], {
        queryParams: {
          day: event.day,
        }
      });
    } else {
      this.router.navigate(['/event-booking/tickets/mobile/stadium', event.id]);
    }
  }

}
