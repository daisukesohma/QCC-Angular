import { Component, OnInit, OnDestroy, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventBookingService } from '../../event-booking.service';
import { AppService } from 'src/app/app.service';
import { EventService } from 'src/app/events-page/events/event.service';
import { Subscription } from 'rxjs';
import { TabsetComponent } from 'ngx-bootstrap/tabs/ngx-bootstrap-tabs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'qcc-event-tickets',
  templateUrl: './event-tickets.component.html',
  styleUrls: ['./event-tickets.component.css']
})
export class EventTicketsComponent implements OnInit, OnDestroy {
  userDataSubscription: Subscription;
  eventId: any;
  eventType: any;
  clubEvents: any[] = [];
  stadiumEvents: any[] = [];
  eventList: any = [];
  eventData: any = {};
  userMemberDetails: any = {};
  pay = 0;
  isComplementaryTicketExists: boolean;
  currentYear = new Date().getFullYear();
  familyNumber: any;
  familyData: any[] = [];
  memberShipName: any;
  familyLinking: any;
  initialPayAmount: number;
  responseErrorMessage: boolean = false;
  userDetails: any;
  membershipDetails: any = {};
  display: boolean;
  userDataSub: Subscription;
  annualComplementary: number;
  remainingAnnualComplementary: number;
  totalComp: number;
  day: string;
  complimentaryTicketsAnnual: any;
  sideNavOpen: boolean = false;
  loading: boolean;
  @ViewChild('tabset', { static: false }) tabset: TabsetComponent;
  @ViewChild('insideElement', { static: false }) insideElement: any;
  @ViewChild('openbtn', { static: false }) openbtn: any;
  userDisplayName: string = '';
  userDisplaylastName: string = '';
  linkedFamily: any;
  alreadLinked: boolean;
  familyLinked: any[] = [];
  memberShipCategory: any = {};
  constructor(
    public activatedRoute: ActivatedRoute,
    public authService: AuthService,
    public bookingService: EventBookingService,
    public eventService: EventService,
    public appService: AppService,
    public router: Router,
  ) {
    this.eventId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.activatedRoute.snapshot.queryParamMap.get('day')) {
      this.day = this.activatedRoute.snapshot.queryParamMap.get('day');
    }
  }

  ngOnInit() {
    this.getStadiumEvents();
    this.userDisplayName = localStorage.getItem('loggedUser');
    this.userDisplaylastName = localStorage.getItem('user');

    this.broadcastUserData();
    const userDetails = this.eventService.userDetails;
    if (userDetails) {
      this.userDetails = userDetails.adminConfig;
      this.membershipDetails = userDetails.memberCategory;
      if (this.router.url === '/stadium-event') {
        this.display = this.membershipDetails.stadiumSeats ? false : true;
      }
    }
  }

  ngOnDestroy() {
    if (this.userDataSub) {
      this.userDataSub.unsubscribe();
    }
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

  getStadiumEvents() {
    this.loading = true;
    this.bookingService.getStadiumEvents(this.eventId).subscribe((response: any) => {
      this.memberShipCategory = response.data.memberCategory;
      if (response.data.events) {
        this.eventList = response.data.events;
        for (const data of this.eventList) {
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
        if (!this.day) {
          this.eventData = this.eventList.find((el) => {
            return el.id === +this.eventId;
          });
        } else {
          this.eventData = this.eventList.find((el) => {
            return el.id === +this.eventId && el.day === +this.day;
          });
        }
        this.familyData = JSON.parse(JSON.stringify(this.eventData.familyLinking ?
          this.eventData.familyLinking : []));
        this.linkedFamily = JSON.parse(JSON.stringify(this.eventData.linkedFamilyMemberNo ?
          this.eventData.linkedFamilyMemberNo : []));
        this.getCompTickets();
        this.payableAmount();
      }
      this.loading = false;
    }, (error) => {
      this.loading = false;
    });
  }

  /**
   * GET comp tickets annually
   */
  getCompTickets() {
    const isComplementaryTicketExists = this.eventList.some((el) => {
      return el.complimentaryTicketsAnnual;
    });
    if (isComplementaryTicketExists) {
      const annualComp = this.eventList.find((el) => {
        return el.complimentaryTicketsAnnual;
      });
      let purchaseComp = 0;
      this.eventList.forEach((el) => {
        const purch = el.purchasedComplimentryTickets ? el.purchasedComplimentryTickets : 0;
        purchaseComp = purchaseComp + purch;
      });
      this.annualComplementary = annualComp.complimentaryTicketsAnnual - purchaseComp;
      this.remainingAnnualComplementary = annualComp.complimentaryTicketsAnnual - purchaseComp;
      this.checkComplementary();
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
    });
  }

  /**
   * check complementary tickets for annual
   * @param fieldName column name
   */
  checkComplementary() {
    let count = 0;
    this.isComplementaryTicketExists = false;
    this.eventList.forEach((el) => {
      count = count + el.complementary;
    });
    const annualComp = this.eventList.find((el) => {
      return el.complimentaryTicketsAnnual;
    });
    const annualComplementary = annualComp.complimentaryTicketsAnnual;
    if (annualComplementary === count) {
      this.isComplementaryTicketExists = true;
    } else {
      this.isComplementaryTicketExists = false;
    }
  }

  /**
   * adding ticket
   */
  addTicket(fieldName) {
    if (fieldName === 'complementary') {
      if (this.eventData.complimentaryTicketsAnnual) {
        this.eventData.complementary = Number(this.eventData.complementary) + 1;
        this.annualComplementary = this.annualComplementary - 1;
        this.checkComplementary();
      } else {
        this.eventData.complementary =
          Number(this.eventData.complementary) + 1;
      }
    } else {
      this.eventData[fieldName] = Number(this.eventData[fieldName]) + 1;
    }
    this.updateSessionArray();
  }

  /**
   * subtract ticket
   */
  subTicket(field) {
    this.eventData[field] = Number(this.eventData[field]) - 1;
    if (field === 'complementary') {
      this.isComplementaryTicketExists = false;
      if (this.eventData.complimentaryTicketsAnnual) {
        this.annualComplementary = this.annualComplementary + 1;
        this.checkComplementary();
      }
    }
    this.updateSessionArray();
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
    this.appService.showLoader(true);
    const eventDay = this.eventData.day ? this.eventData.day : 1;
    if (this.eventData.familyLinking.indexOf(memberNumber) > -1) {
      this.alreadLinked = true;
      this.appService.showLoader(false);
      return;
    }
    this.bookingService.validateFamily(memberNumber, this.eventData.id, eventDay).subscribe((response: any) => {
      this.responseErrorMessage = false;
      this.alreadLinked = false;
      // if (response.data && this.familyData.indexOf(memberNumber) < 0) {
      //   this.familyData.push(memberNumber);
      //   this.familyNumber = '';
      //   this.eventData.familyLinking = this.familyData;
      //   this.payableAmount();
      // }
      if (response.data && this.familyData.indexOf(memberNumber) < 0) {
        this.familyLinked.push({
          member: memberNumber,
          memberTicketPrice: response.data.memberTicketPrice,
          memberTicketDiscountedPrice: response.data.memberTicketDiscountedPrice
        });
        this.familyData.push(memberNumber);
        this.familyNumber = '';
        this.eventData.familyLinked = this.familyLinked;
        this.eventData.familyLinking = this.familyData;
        const msgData = {
          type: 'success',
          msg: 'Member Linked Successfully',
        };
        this.payableAmount();
        this.appService.changeToastMessage(msgData);
      }
      this.appService.showLoader(false);
    },
      (error) => {
        this.appService.showLoader(false);
        this.responseErrorMessage = true;
        this.alreadLinked = false;
      });
  }

  /**
   * remove family linking
   * @param rowIndex index
   */
  removeLinking(rowIndex) {
    const eventIndex = this.eventList.findIndex((el) => {
      return el.id === this.eventData.id;
    });
    this.eventList[eventIndex].familyLinking.splice(rowIndex, 1);
    this.eventList[eventIndex].familyLinked.splice(rowIndex, 1);
    this.familyData = this.eventList[eventIndex].familyLinking;
    this.payableAmount();
  }

  /**
   * update session storage array after changing
   */
  updateSessionArray() {
    const index = this.eventList.findIndex((el) => {
      return el.id === this.eventId;
    });
    this.eventList[index] = this.eventData;
    sessionStorage.setItem('stadiumEvents', JSON.stringify(this.eventList));
    this.payableAmount();
  }

  /**
   * calculate payable amount
   */
  payableAmount() {
    this.pay = this.getPayableAmount(this.eventList);
    this.initialPayAmount = this.getInitialPayableAmount(this.eventList);
    this.isEligibleToBuy();
  }

  /**
   * get unlinked family number
   */
  getUnlinkedFamily(eventData, isInitial?) {
    let newFamily = 0;
    if (eventData.familyLinked && eventData.familyLinked.length > 0) {
      eventData.familyLinked.forEach((el, index) => {
        if (el.memberTicketDiscountedPrice && el.memberTicketDiscountedPrice !== el.memberTicketPrice && !isInitial) {
          newFamily = newFamily + el.memberTicketDiscountedPrice;
        } else if (isInitial || (el.memberTicketDiscountedPrice && el.memberTicketDiscountedPrice === el.memberTicketPrice)) {
          newFamily = newFamily + el.memberTicketPrice;
        }
      });
    }
    return newFamily;
  }

  /**
   * to get Payable amount
   * @param array club or stadium
   */
  getPayableAmount(array) {
    let finalpay = 0;
    this.totalComp = 0;
    for (const evenData of array) {
      const discPrice = evenData.memberTicketDiscountedPrice ? evenData.memberTicketDiscountedPrice : evenData.memberTicketPrice;
      const pay1 = discPrice *
        (Math.sign(evenData.totalMemberTickets - (evenData.purchasedMemberTickets ? evenData.purchasedMemberTickets : 0)) >= 0 ?
          (evenData.totalMemberTickets - (evenData.purchasedMemberTickets ? evenData.purchasedMemberTickets : 0)) : 0);
      const pay2 = evenData.guestTicketPrice *
        ((Math.sign(evenData.totalGuestTickets - (evenData.purchasedGuestTickets ? evenData.purchasedGuestTickets : 0)) >= 0 ?
          (evenData.totalGuestTickets - (evenData.purchasedGuestTickets ? evenData.purchasedGuestTickets : 0)) : 0));
      const pay3 = evenData.childTicketPrice *
        (Math.sign(evenData.totalChildTickets - (evenData.purchasedChildTickets ? evenData.purchasedChildTickets : 0)) >= 0 ?
          (evenData.totalChildTickets - (evenData.purchasedChildTickets ? evenData.purchasedChildTickets : 0)) : 0);
      const pay4 = evenData.diningTicketPrice *
        (Math.sign(evenData.restaurantTickets - (evenData.purchasedDininigTickets ? evenData.purchasedDininigTickets : 0)) >= 0 ?
          (evenData.restaurantTickets - (evenData.purchasedDininigTickets ? evenData.purchasedDininigTickets : 0)) : 0);
      const unlinkedFamily = this.getUnlinkedFamily(evenData);
      const pay5 = unlinkedFamily;
      // const pay5 = 0;
      finalpay = pay3 + pay1 + pay2 + pay4 + pay5 + finalpay;
      this.totalComp = this.totalComp + (Math.sign(evenData.complementary -
        (evenData.purchasedComplimentryTickets ? evenData.purchasedComplimentryTickets : 0)) >= 0 ?
        (evenData.complementary - (evenData.purchasedComplimentryTickets ? evenData.purchasedComplimentryTickets : 0)) : 0)
    }
    return finalpay;
  }


  getInitialPayableAmount(array) {
    let finalpay = 0;
    for (const evenData of array) {
      const pay1 = evenData.memberTicketPrice *
        (Math.sign(evenData.totalMemberTickets - (evenData.purchasedMemberTickets ? evenData.purchasedMemberTickets : 0)) >= 0 ?
          (evenData.totalMemberTickets - (evenData.purchasedMemberTickets ? evenData.purchasedMemberTickets : 0)) : 0);
      const pay2 = evenData.guestTicketPrice *
        ((Math.sign(evenData.totalGuestTickets - (evenData.purchasedGuestTickets ? evenData.purchasedGuestTickets : 0)) >= 0 ?
          (evenData.totalGuestTickets - (evenData.purchasedGuestTickets ? evenData.purchasedGuestTickets : 0)) : 0));
      const pay3 = evenData.childTicketPrice *
        (Math.sign(evenData.totalChildTickets - (evenData.purchasedChildTickets ? evenData.purchasedChildTickets : 0)) >= 0 ?
          (evenData.totalChildTickets - (evenData.purchasedChildTickets ? evenData.purchasedChildTickets : 0)) : 0);
      const pay4 = evenData.diningTicketPrice *
        (Math.sign(evenData.restaurantTickets - (evenData.purchasedDininigTickets ? evenData.purchasedDininigTickets : 0)) >= 0 ?
          (evenData.restaurantTickets - (evenData.purchasedDininigTickets ? evenData.purchasedDininigTickets : 0)) : 0);
      const unlinkedFamily = this.getUnlinkedFamily(evenData, 'isInitial');
      const pay5 = unlinkedFamily;
      finalpay = pay3 + pay1 + pay2 + pay4 + pay5 + finalpay;
    }
    return finalpay;
  }

  /**
   * creating payment
   */
  createPayment() {
    this.appService.showLoader(true);
    const team = [];
    const eventPurchasedData = [];
    let totalTicket = 0;
    const eventLists = this.eventList;
    for (const iterator of eventLists) {
      const childTicket = iterator.purchasedChildTickets ?
        iterator.totalChildTickets - iterator.purchasedChildTickets : iterator.totalChildTickets;
      const guestTicket = iterator.purchasedGuestTickets ?
        iterator.totalGuestTickets - iterator.purchasedGuestTickets : iterator.totalGuestTickets;
      const memberTicket = iterator.purchasedMemberTickets ?
        iterator.totalMemberTickets - iterator.purchasedMemberTickets : iterator.totalMemberTickets;
      const resturantTicket = iterator.purchasedDininigTickets ?
        iterator.restaurantTickets - iterator.purchasedDininigTickets : iterator.restaurantTickets;
      const complementaryTicket = iterator.purchasedComplimentryTickets ?
        iterator.complementary - iterator.purchasedComplimentryTickets : iterator.complementary;
      const linkedLength = iterator.familyLinked ? iterator.familyLinked.length : 0;
      totalTicket = totalTicket + childTicket + guestTicket
        + memberTicket + resturantTicket + complementaryTicket + linkedLength;
      if (childTicket !== 0 || guestTicket !== 0 || memberTicket !== 0 || resturantTicket !== 0 ||
        complementaryTicket !== 0 || (iterator.familyLinked && iterator.familyLinked.length !== 0)) {
        eventPurchasedData.push({
          eventName: iterator.name,
          childTickets: childTicket,
          guestTickets: guestTicket,
          memberTickets: memberTicket,
          restaurantTickets: resturantTicket,
          familyLinking: iterator.familyLinked ? iterator.familyLinked : null,
          day: iterator.day ? iterator.day : null,
          complementary: complementaryTicket,
          complimentaryTicketsAnnual: iterator.complimentaryTicketsAnnual ? iterator.complimentaryTicketsAnnual : null,
          complimentaryTicketsPerStadiumEvent: iterator.complimentaryTicketsPerStadiumEvent ?
            iterator.complimentaryTicketsPerStadiumEvent : null,
          // prices
          memberTicketPrice: iterator.memberTicketPrice,
          guestTicketPrice: iterator.guestTicketPrice,
          childTicketPrice: iterator.childTicketPrice,
          diningTicketPrice: iterator.diningTicketPrice,
        });
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
          familyLinking: iterator.familyLinking.length ? iterator.familyLinking : null,
          day: iterator.day ? iterator.day : null,
          complementary: iterator.purchasedComplimentryTickets ?
            iterator.complementary - iterator.purchasedComplimentryTickets : iterator.complementary,
          complimentaryTicketsAnnual: iterator.complimentaryTicketsAnnual ? iterator.complimentaryTicketsAnnual : null,
          complimentaryTicketsPerStadiumEvent: iterator.complimentaryTicketsPerStadiumEvent ?
            iterator.complimentaryTicketsPerStadiumEvent : null,
        });
      }
    }
    team.push({
      totalAmount: this.initialPayAmount,
      discountedAmount: this.pay,
      totalTickets: totalTicket,
      eventPurchasedList: eventPurchasedData
    });
    localStorage.setItem('paymentDetails', JSON.stringify(team));
    sessionStorage.setItem('stadiumEvents', JSON.stringify(this.stadiumEvents));
    this.appService.showLoader(false);
    this.router.navigate(['/order-details']);
  }

  /**
   * valida is elgible user to purchase tickets
   */
  isEligibleToBuy() {
    if (this.pay !== 0 || this.totalComp !== 0) {
      return false;
    } else {
      return true;
    }
  }
}
