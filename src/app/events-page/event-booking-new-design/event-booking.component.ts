import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AppService } from '../../app.service';
import { EventBookingService } from './event-booking.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { Dialog } from 'primeng/dialog';
import { AuthService } from 'src/app/auth/auth.service';
import { EventService } from '../events/event.service';

@Component({
  selector: 'qcc-corp-mem-club',
  templateUrl: './event-booking.component.html',
  styleUrls: ['./event-booking.component.css'],
  providers: [EventBookingService],
})
export class CorpMemClubComponentNew implements OnInit, OnDestroy {
  userDataSub: Subscription;
  cols: any[];
  eventBookingData: any[] = [];
  frozenCols: any[];
  stadiumCols: any[];
  eventCols: any[];
  memberShipName: string;
  pay = 0;
  userDetails: any = {};
  bannerUrl = '/assets/images/banners/nav-banner.png';
  selectedStadium: any;
  display = false;
  familyLinkingPopup = false;
  familyLinking = false;
  memberShipExpired = false;
  familyNumber = '';
  @ViewChild('dialog', { static: false }) dialog: any;
  @ViewChild('familyLinkingModal', { static: false }) familyLinkingModal: any;
  familyData: any[] = [];
  clubEvents: any[] = [];
  stadiumEvents: any[] = [];
  familyEventId: number;
  complimentaryTicketsPerStadiumEvent: any;
  complimentaryTicketsAnnual: any;
  isComplementaryTicketExists: boolean;
  dining: any;
  initialPayAmount: number;
  currentYear = new Date().getFullYear();
  membershipDetails: any = {};
  memberShipCategory: any = {};
  eventId: number;

  constructor(
    public appService: AppService,
    public router: Router,
    public eventService: EventService,
    public authService: AuthService,
    public atcivatedRoute: ActivatedRoute,
    public bookingService: EventBookingService) {
    // this.stadiumCols = [
    //   { field: 'memberTicketPrice', header: 'Seat Price' },
    //   { field: 'memberTicketDiscountedPrice', header: 'Discount Price' },
    //   { field: 'totalMemberTickets', header: 'No. of Tickets' },
    //   { field: 'guestTicketPrice', header: 'Guests Price' },
    //   { field: 'totalGuestTickets', header: 'No. of Tickets' },
    //   { field: 'childTicketPrice', header: 'Child Ticket Price' },
    //   { field: 'totalChildTickets', header: 'No. of Tickets' },
    //   { field: 'diningTicketPrice', header: 'Dining Price' },
    //   { field: 'restaurantTickets', header: 'No. of Seats' },
    //   { field: 'familyLinking', header: 'Family Linking' },
    // ];
    // this.eventCols = [
    //   { field: 'memberTicketPrice', header: 'Seat Price' },
    //   { field: 'memberTicketDiscountedPrice', header: 'Discount Price' },
    //   { field: 'totalMemberTickets', header: 'No. of Tickets' },
    //   { field: 'guestTicketPrice', header: 'Guests Price' },
    //   { field: 'totalGuestTickets', header: 'No. of Tickets' },
    //   { field: 'childTicketPrice', header: 'Child Ticket Price' },
    //   { field: 'totalChildTickets', header: 'No. of Tickets' },
    //   { field: 'diningTicketPrice', header: 'Restaurant Price' },
    //   { field: 'restaurantTickets', header: 'No. of Seats' },
    // ];
    // this.frozenCols = [
    //   { field: 'eventName', header: 'Event' }
    // ];
    this.clubEvents = sessionStorage.getItem('clubEvents') ?
      JSON.parse(sessionStorage.getItem('clubEvents')) : [];

    this.stadiumEvents = sessionStorage.getItem('stadiumEvents') ?
      JSON.parse(sessionStorage.getItem('stadiumEvents')) : [];

    this.memberShipName = sessionStorage.getItem('memberShipName') ? sessionStorage.getItem('memberShipName') : '';
    this.memberShipCategory = sessionStorage.getItem('memberShipCategory') ? sessionStorage.getItem('memberShipCategory') : {};
    // if (this.memberShipName === 'QC500' || this.memberShipName === 'QCC Ambassadors') {
    //   this.stadiumCols.splice(9, 0, { field: 'compTicket', header: 'Complementary Tickets' },
    //     { field: 'complementary', header: 'No. of Seats' });
    // }
    // this.complimentaryTicketsAnnual = sessionStorage.getItem('complimentaryTicketsAnnual')
    //   ? sessionStorage.getItem('complimentaryTicketsAnnual') : undefined;
    // this.complimentaryTicketsPerStadiumEvent = sessionStorage.getItem('complimentaryTicketsPerStadiumEvent')
    //   ? sessionStorage.getItem('complimentaryTicketsPerStadiumEvent') : undefined;

    // if (this.router.url === '/club-event') {
    //   this.eventBookingData = this.clubEvents;
    //   this.selectedStadium = 'club';
    //   this.cols = this.eventCols;
    // } else {
    this.eventBookingData = this.stadiumEvents;
    //   this.selectedStadium = 'stadium';
    //   this.cols = this.stadiumCols;
    // }
    // this.familyLinking = sessionStorage.hasOwnProperty('familyLinking') ?
    //   JSON.parse(sessionStorage.getItem('familyLinking')) : false;
    // if (sessionStorage.hasOwnProperty('familyLinking') && JSON.parse(sessionStorage.getItem('familyLinking')) === false) {
    //   this.stadiumCols.pop();
    // }
    // if (sessionStorage.hasOwnProperty('dining') && JSON.parse(sessionStorage.getItem('dining')) === false) {
    //   this.stadiumCols.splice(6, 2);
    //   this.eventCols.splice(7, 2);
    // }
    // if (sessionStorage.hasOwnProperty('childTickets') && JSON.parse(sessionStorage.getItem('childTickets')) === 0) {
    //   this.stadiumCols.splice(5, 2);
    //   this.eventCols.splice(5, 2);
    // }

  }

  ngOnInit() {
    this.atcivatedRoute.paramMap.subscribe((params) =>
      this.eventId = +params.get('id'),
    );
    this.broadcastUserData();
    if (this.eventId) {
      sessionStorage.clear();
      this.getStadiumEvents();
    }
    if (!sessionStorage.hasOwnProperty('stadiumEvents') && !sessionStorage.hasOwnProperty('clubEvents')) {
      this.appService.showLoader(true);
      this.getStadiumEvents();
    } else {
      this.payableAmount();
    }

    const userDetails = this.eventService.userDetails;
    if (userDetails) {
      this.userDetails = userDetails.adminConfig;
      this.membershipDetails = userDetails.memberCategory;
      if (this.router.url === '/stadium-event') {
        this.display = this.membershipDetails.stadiumSeats ? false : true;
      }
      // if (!this.membershipDetails.discountedPrice || this.membershipDetails.discountedPrice === 0) {
      //   this.eventCols.splice(1, 1);
      //   this.stadiumCols.splice(1, 1);
      // }
      // this.updateColsAndBanner();
    }
  }

  ngOnDestroy() {
    if (this.userDataSub) {
      this.userDataSub.unsubscribe();
    }
  }

  /**
   * broadcasted user data
   */
  broadcastUserData() {
    this.userDataSub = this.appService.userSourceState$.subscribe((data: any) => {
      this.userDetails = data.adminConfig;
      this.membershipDetails = data.memberCategory;
      if (this.router.url === '/stadium-event') {
        this.display = this.membershipDetails.stadiumSeats ? false : true;
      }
      // if (!this.membershipDetails.discountedPrice || this.membershipDetails.discountedPrice === 0) {
      //   this.eventCols.splice(1, 1);
      //   this.stadiumCols.splice(1, 1);
      // }
      // this.updateColsAndBanner();
    });
  }


  // getSelectedItem(event) {
  //   this.selectedStadium = event.column;
  //   if (event.stadiumEvent) {
  //     this.updateColsAndBanner();
  //   } else if (this.selectedStadium !== 'club') {
  //     this.display = true;
  //   }
  // }

  /**
   * update table columns and banner
   */
  updateColsAndBanner() {
    if (this.selectedStadium === 'club') {
      this.eventBookingData = this.clubEvents;
      this.cols = this.eventCols;
      this.bannerUrl = this.userDetails.clubBannerUrl ? this.userDetails.clubBannerUrl : this.bannerUrl;
    } else {
      this.cols = this.stadiumCols;
      this.eventBookingData = this.stadiumEvents;
      this.bannerUrl = this.userDetails.stadiumBannerUrl ? this.userDetails.stadiumBannerUrl : this.bannerUrl;
    }
  }

  getStadiumEvents() {
    this.bookingService.getStadiumEvents(this.eventId).subscribe((response: any) => {
      this.appService.showLoader(false);
      this.validateMembershipExpired(response.data.memberCategory.membershipExiryDate);
      this.memberShipCategory = response.data.memberCategory;
      this.memberShipName = response.data.memberCategory.name;
      this.familyLinking = response.data.memberCategory.familyLinking;
      const dining = response.data.memberCategory.dining;
      const childTickets = response.data.memberCategory.childTickets;
      sessionStorage.setItem('memberShipName', this.memberShipName);
      sessionStorage.setItem('memberShipCategory', this.memberShipCategory);
      // if (this.memberShipName === 'QC500' || this.memberShipName === 'QCC Ambassadors') {
      //   this.stadiumCols.splice(9, 0, { field: 'compTicket', header: 'Complementary Tickets' },
      //     { field: 'complementary', header: 'No. of Seats' });
      // }
      // if (!this.familyLinking) {
      //   this.stadiumCols.pop();
      // }
      // if (!dining) {
      //   this.stadiumCols.splice(6, 2);
      //   this.eventCols.splice(7, 2);
      // }
      // if (childTickets === 0) {
      //   this.stadiumCols.splice(5, 2);
      //   this.eventCols.splice(5, 2);
      // }
      let stadiumEventLists = [];
      if (response.data.events) {
        stadiumEventLists = response.data.events;
        for (const data of stadiumEventLists) {
          data.eventName = data.name;
          data.totalMemberTickets = data.purchasedMemberTickets ? data.purchasedMemberTickets : 0;
          data.totalGuestTickets = data.purchasedGuestTickets ? data.purchasedGuestTickets : 0;
          data.restaurantTickets = data.purchasedDininigTickets ? data.purchasedDininigTickets : 0;
          data.totalChildTickets = 0;
          data.complementary = data.purchasedComplimentryTickets ? data.purchasedComplimentryTickets : 0;
          data.familyLinking = [];
          data.memberTicketPrice = data.memberTicketPrice ? data.memberTicketPrice : 0;
          data.guestTicketPrice = data.guestTicketPrice ? data.guestTicketPrice : 0;
          data.childTicketPrice = data.childTicketPrice ? data.childTicketPrice : 0;
          data.diningTicketPrice = data.diningTicketPrice ? data.diningTicketPrice : 0;
        }
      }
      if (!sessionStorage.hasOwnProperty('stadiumEvents') &&
        response.data.memberCategory.stadiumSeats) {
        sessionStorage.setItem('stadiumEvents', JSON.stringify(stadiumEventLists));
      }
      // if (!sessionStorage.hasOwnProperty('familyLinking')) {
      //   sessionStorage.setItem('familyLinking', JSON.stringify(this.familyLinking));
      // }
      // if (!sessionStorage.hasOwnProperty('dining')) {
      //   sessionStorage.setItem('dining', JSON.stringify(dining));
      // }
      // if (!sessionStorage.hasOwnProperty('childTickets')) {
      //   sessionStorage.setItem('childTickets', JSON.stringify(childTickets));
      // }
      this.stadiumEvents = stadiumEventLists;
      this.eventBookingData = this.stadiumEvents;
      // this.updateColsAndBanner();
    }, (error) => {
      this.appService.showLoader(false);
    });
  }

  getClubEvents() {
    this.bookingService.getClubEvents().subscribe((response: any) => {
      this.appService.showLoader(false);
      this.memberShipName = response.data.memberCategory.name;
      this.validateMembershipExpired(response.data.memberCategory.membershipExiryDate);
      this.appService.accessStadium(response.data.memberCategory.stadiumSeats);
      if (response.data.events) {
        const clubEventLists = response.data.events;
        for (const data of clubEventLists) {
          data.eventName = data.name;
          data.totalMemberTickets = data.purchasedMemberTickets ? data.purchasedMemberTickets : 0;
          data.totalGuestTickets = data.purchasedGuestTickets ? data.purchasedGuestTickets : 0;
          data.restaurantTickets = data.purchasedDininigTickets ? data.purchasedDininigTickets : 0;
          data.totalChildTickets = 0;
          data.memberTicketPrice = data.memberTicketPrice ? data.memberTicketPrice : 0;
          data.guestTicketPrice = data.guestTicketPrice ? data.guestTicketPrice : 0;
          data.childTicketPrice = data.childTicketPrice ? data.childTicketPrice : 0;
          data.diningTicketPrice = data.diningTicketPrice ? data.diningTicketPrice : 0;
        }
        if (!sessionStorage.hasOwnProperty('clubEvents')) {
          sessionStorage.setItem('clubEvents', JSON.stringify(clubEventLists));
        }
        this.clubEvents = clubEventLists;
      }
      this.updateColsAndBanner();
    }, (error) => {
      this.appService.showLoader(false);
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

  /**
   * check complementary tickets for annual
   * @param fieldName column name
   */
  checkComplementary(rowIndex) {
    let count = 0;
    this.isComplementaryTicketExists = false;
    this.eventBookingData[rowIndex].complementary = Number(this.eventBookingData[rowIndex].complementary) + 1;
    this.eventBookingData.forEach((el) => {
      count = count + el.complementary;
    });
    if (this.eventBookingData[rowIndex].complimentaryTicketsAnnual === count) {
      this.isComplementaryTicketExists = true;
    } else {
      this.isComplementaryTicketExists = false;
    }
  }

  /**
   * Add 1 number in selected field
   * @param fieldName Column name
   * @param rowIndex index of selected Row
   */
  addNumber(fieldName, rowIndex) {
    if (fieldName === 'complementary') {
      if (this.eventBookingData[rowIndex].complimentaryTicketsAnnual) {
        this.checkComplementary(rowIndex);
      } else {
        this.eventBookingData[rowIndex].complementary =
          Number(this.eventBookingData[rowIndex].complementary) + 1;
      }
    } else {
      this.eventBookingData[rowIndex][fieldName] = Number(this.eventBookingData[rowIndex][fieldName]) + 1;
    }

    this.updateSessionArray();
  }

  /**
   * subtract 1 number in selected field
   * @param fieldName Column name
   * @param rowIndex index of selected Row
   */
  subNumber(fieldName, rowIndex) {
    this.eventBookingData[rowIndex][fieldName] = Number(this.eventBookingData[rowIndex][fieldName]) - 1;
    if (fieldName === 'complementary') {
      this.isComplementaryTicketExists = false;
    }
    this.updateSessionArray();
  }

  /**
   * update session storage array after changing
   */
  updateSessionArray() {
    if (this.selectedStadium === 'club') {
      sessionStorage.setItem('clubEvents', JSON.stringify(this.eventBookingData));
    } else {
      sessionStorage.setItem('stadiumEvents', JSON.stringify(this.eventBookingData));
    }
    this.payableAmount();
  }

  /**
   * calculate payable amount
   */
  payableAmount() {
    this.pay = this.getPayableAmount(this.clubEvents) + this.getPayableAmount(this.stadiumEvents);
    this.initialPayAmount = this.getInitialPayableAmount(this.clubEvents) + this.getInitialPayableAmount(this.stadiumEvents);
  }

  /**
   * to get Payable amount
   * @param array club or stadium
   */
  getPayableAmount(array) {
    let finalpay = 0;
    for (const evenData of array) {
      const discPrice = evenData.memberTicketDiscountedPrice ? evenData.memberTicketDiscountedPrice : evenData.memberTicketPrice;
      const pay1 = discPrice *
        (Math.sign(evenData.totalMemberTickets - (evenData.purchasedTickets ? evenData.purchasedMemberTickets : 0)) >= 0 ?
          (evenData.totalMemberTickets - (evenData.purchasedTickets ? evenData.purchasedMemberTickets : 0)) : 0);
      const pay2 = evenData.guestTicketPrice *
        ((Math.sign(evenData.totalGuestTickets - (evenData.purchasedTickets ? evenData.purchasedGuestTickets : 0)) >= 0 ?
          (evenData.totalGuestTickets - (evenData.purchasedTickets ? evenData.purchasedGuestTickets : 0)) : 0));
      const pay3 = evenData.childTicketPrice *
        (Math.sign(evenData.totalChildTickets - (evenData.purchasedTickets ? evenData.purchasedChildTickets : 0)) >= 0 ?
          (evenData.totalChildTickets - (evenData.purchasedTickets ? evenData.purchasedChildTickets : 0)) : 0);
      const pay4 = evenData.diningTicketPrice *
        (Math.sign(evenData.restaurantTickets - (evenData.purchasedTickets ? evenData.purchasedDininigTickets : 0)) >= 0 ?
          (evenData.restaurantTickets - (evenData.purchasedTickets ? evenData.purchasedDininigTickets : 0)) : 0);
      const pay5 = evenData.memberTicketPrice * (evenData.familyLinking ? evenData.familyLinking.length : 0);
      finalpay = pay3 + pay1 + pay2 + pay4 + pay5 + finalpay;
    }
    return finalpay;
  }

  getInitialPayableAmount(array) {
    let finalpay = 0;
    for (const evenData of array) {
      const pay1 = evenData.memberTicketPrice *
        (Math.sign(evenData.totalMemberTickets - (evenData.purchasedTickets ? evenData.purchasedMemberTickets : 0)) >= 0 ?
          (evenData.totalMemberTickets - (evenData.purchasedTickets ? evenData.purchasedMemberTickets : 0)) : 0);
      const pay2 = evenData.guestTicketPrice *
        ((Math.sign(evenData.totalGuestTickets - (evenData.purchasedTickets ? evenData.purchasedGuestTickets : 0)) >= 0 ?
          (evenData.totalGuestTickets - (evenData.purchasedTickets ? evenData.purchasedGuestTickets : 0)) : 0));
      const pay3 = evenData.childTicketPrice *
        (Math.sign(evenData.totalChildTickets - (evenData.purchasedTickets ? evenData.purchasedChildTickets : 0)) >= 0 ?
          (evenData.totalChildTickets - (evenData.purchasedTickets ? evenData.purchasedChildTickets : 0)) : 0);
      const pay4 = evenData.diningTicketPrice *
        (Math.sign(evenData.restaurantTickets - (evenData.purchasedTickets ? evenData.purchasedDininigTickets : 0)) >= 0 ?
          (evenData.restaurantTickets - (evenData.purchasedTickets ? evenData.purchasedDininigTickets : 0)) : 0);

      const pay5 = evenData.memberTicketPrice * (evenData.familyLinking ? evenData.familyLinking.length : 0);
      finalpay = pay3 + pay1 + pay2 + pay4 + pay5 + finalpay;
    }
    return finalpay;
  }

  /**
   * paymentRedirection
   */
  paymentRedirection() {
    this.appService.showLoader(true);
    const team = [];
    let totalTicket = 0;
    const eventLists = [...this.eventBookingData];
    for (const iterator of eventLists) {
      totalTicket = totalTicket + iterator.totalChildTickets + iterator.totalGuestTickets
        + iterator.totalMemberTickets + iterator.restaurantTickets;
      team.push({
        eventId: iterator.id,
        childTickets:
          iterator.purchasedChildTickets ? iterator.totalChildTickets - iterator.purchasedChildTickets : iterator.totalChildTickets,
        guestTickets:
          iterator.purchasedGuestTickets ? iterator.totalGuestTickets - iterator.purchasedGuestTickets : iterator.totalGuestTickets,
        memberTickets:
          iterator.purchasedMemberTickets ? iterator.totalMemberTickets - iterator.purchasedMemberTickets : iterator.totalMemberTickets,
        restaurantTickets:
          iterator.purchasedDininigTickets ? iterator.restaurantTickets - iterator.purchasedDininigTickets : iterator.restaurantTickets,
        familyLinking: iterator.familyLinking && iterator.familyLinking.length ? iterator.familyLinking : null,
        day: iterator.day ? iterator.day : null,
        complementary: iterator.complementary ? iterator.complementary : null,
        complimentaryTicketsAnnual: iterator.complimentaryTicketsAnnual ? iterator.complimentaryTicketsAnnual : null,
        complimentaryTicketsPerStadiumEvent: iterator.complimentaryTicketsPerStadiumEvent ?
          iterator.complimentaryTicketsPerStadiumEvent : null,
      });
    }
    team.push({ totalAmount: this.initialPayAmount, discountedAmount: this.pay, totalTickets: totalTicket });
    localStorage.setItem('paymentDetails', JSON.stringify(team));
    this.appService.showLoader(false);
    this.router.navigate(['/order-details']);
  }

  /**
   * trim text box value
   * @param event input value
   */
  trimValue(event) {
    this.familyNumber = event.target.value.trim();
  }

  /**
   * family linking
   * @param memberNumber to link
   */
  ValidateFamily(memberNumber) {
    const eventData = this.eventBookingData.findIndex((el) => {
      return el.id === this.familyEventId;
    });
    this.appService.showLoader(true);
    this.bookingService.validateFamily(memberNumber, this.familyEventId).subscribe((response: any) => {
      if (response.data && this.familyData.indexOf(memberNumber) < 0) {
        this.familyData.push(memberNumber);
        this.familyNumber = '';
        this.stadiumEvents[eventData].familyLinking = this.familyData;
        const msgData = {
          type: 'success',
          msg: 'Member Linked Successfully',
        };
        this.payableAmount();
        this.appService.changeToastMessage(msgData);
      } else {
        const msgData = {
          type: 'error',
          msg: 'Member not Linked',
        };
        this.appService.changeToastMessage(msgData);
      }
      this.appService.showLoader(false);
    },
      (error) => {
        this.appService.showLoader(false);
        const msgData = {
          type: 'error',
          msg: error.error.message,
        };
        this.appService.changeToastMessage(msgData);
      });
  }

  /**
   * add family
   * @param rowData selected row's data
   */
  addFamily(rowIndex) {
    if (this.familyLinking && !this.eventBookingData[rowIndex].saleClosed) {
      this.familyLinkingPopup = true;
      this.familyData = this.eventBookingData[rowIndex].familyLinking ? this.eventBookingData[rowIndex].familyLinking : [];
      this.familyEventId = this.eventBookingData[rowIndex].id;
    }
  }

  logout() {
    this.appService.showLoader(true);
    this.authService.logoutUser().subscribe((response: any) => {
      this.appService.showLoader(true);
      localStorage.clear();
      sessionStorage.clear();
      this.router.navigate(['/login']);
      this.appService.showLoader(false);
    }, (error) => {
      this.appService.showLoader(false);
    });
  }


  redirectToClub() {
    this.router.navigate(['/club-event']);
  }

  /**
   *
   */
  downloadEventDoc(rowData) {
    window.open(rowData.pdfUrl, '_blank');
  }
}
