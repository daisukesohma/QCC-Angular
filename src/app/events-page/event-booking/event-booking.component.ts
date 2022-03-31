import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {AppService} from '../../app.service';
import {EventBookingService} from './event-booking.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {Subscription} from 'rxjs';
import {Dialog} from 'primeng/dialog';
import {AuthService} from 'src/app/auth/auth.service';
import {EventService} from '../events/event.service';
import {retry} from 'rxjs/operators';
import {MemberStatus} from '../../shared/MemberStatus';

@Component({
    selector: 'qcc-corp-mem-club',
    templateUrl: './event-booking.component.html',
    styleUrls: ['./event-booking.component.css'],
    providers: [EventBookingService],
})
export class CorpMemClubComponent implements OnInit, OnDestroy {
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
    @ViewChild('dialog', {static: false}) dialog: any;
    @ViewChild('familyLinkingModal', {static: false}) familyLinkingModal: any;
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
    annualComplementary: any;
    remainingAnnualComplementary: number;
    totalComp = 0;
    linkedFamily: any;
    familyEventDay: any;
    familyLinked: any = [];

    constructor(
        public appService: AppService,
        public router: Router,
        public eventService: EventService,
        public authService: AuthService,
        public atcivatedRoute: ActivatedRoute,
        public bookingService: EventBookingService) {
        // this.clubEvents = sessionStorage.getItem('clubEvents') ?
        //   JSON.parse(sessionStorage.getItem('clubEvents')) : [];

        this.stadiumEvents = sessionStorage.getItem('stadiumEvents') ?
            JSON.parse(sessionStorage.getItem('stadiumEvents')) : [];

        // this.memberShipName = sessionStorage.getItem('memberShipName') ? sessionStorage.getItem('memberShipName') : '';
        // this.memberShipCategory = sessionStorage.getItem('memberShipCategory') ? sessionStorage.getItem('memberShipCategory') : {};
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
        if (!sessionStorage.hasOwnProperty('stadiumEvents')) {
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
            this.updateColsAndBanner();
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
            this.updateColsAndBanner();
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
            const memberCategory = response.data.memberCategory;
            this.validateMembershipExpired(memberCategory.membershipExiryDate, memberCategory.memberStatus);
            this.memberShipCategory = memberCategory;
            this.memberShipName = memberCategory.name;
            this.familyLinking = memberCategory.familyLinking;
            const dining = memberCategory.dining;
            const childTickets = memberCategory.childTickets;
            // sessionStorage.setItem('memberShipName', this.memberShipName);
            // sessionStorage.setItem('memberShipCategory', this.memberShipCategory);
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
                    data.restaurantTickets = data.purchasedDininigTickets? data.purchasedDininigTickets : 0;
                    data.totalChildTickets = data.purchasedChildTickets? data.purchasedChildTickets : 0;
                    // data.totalChildTickets = 0;
                    data.complementary = data.purchasedComplimentryTickets ? data.purchasedComplimentryTickets : 0;
                    data.familyLinking = data.linkedFamilyMemberNo ? data.linkedFamilyMemberNo : [];
                    data.memberTicketPrice = data.memberTicketPrice ? data.memberTicketPrice : 0;
                    data.guestTicketPrice = data.guestTicketPrice ? data.guestTicketPrice : 0;
                    data.childTicketPrice = data.childTicketPrice ? data.childTicketPrice : 0;
                    data.diningTicketPrice = data.diningTicketPrice ? data.diningTicketPrice : 0;
                }
            }
            if (!sessionStorage.hasOwnProperty('stadiumEvents') &&
                memberCategory.stadiumSeats) {
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
            const isComplementaryTicketExists = this.eventBookingData.some((el) => {
                return el.complimentaryTicketsAnnual;
            });
            if (isComplementaryTicketExists) {
                const annualComp = this.eventBookingData.find((el) => {
                    return el.complimentaryTicketsAnnual;
                });
                let purchaseComp = 0;
                this.eventBookingData.forEach((el) => {
                    const purch = el.purchasedComplimentryTickets ? el.purchasedComplimentryTickets : 0;
                    purchaseComp = purchaseComp + purch;
                });
                this.annualComplementary = annualComp.complimentaryTicketsAnnual - purchaseComp;
                this.remainingAnnualComplementary = annualComp.complimentaryTicketsAnnual - purchaseComp;
                this.checkComplementary();
            }
        }, (error) => {
            this.appService.showLoader(false);
        });
    }

    getClubEvents() {
        this.bookingService.getClubEvents().subscribe((response: any) => {
            this.appService.showLoader(false);
            const memberCategory = response.data.memberCategory;
            this.memberShipName = memberCategory.name;
            this.validateMembershipExpired(memberCategory.membershipExiryDate, memberCategory.memberStatus);
            this.appService.accessStadium(memberCategory.stadiumSeats);
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
    validateMembershipExpired(expiryDate, memberStatus) {
        if (MemberStatus.Active === memberStatus) {
            this.memberShipExpired = false;           
        }else {
            this.memberShipExpired = true;
            sessionStorage.clear();
        }
    }

    /**
     * check complementary tickets for annual
     * @param fieldName column name
     */
    checkComplementary() {
        let count = 0;
        this.isComplementaryTicketExists = false;
        this.eventBookingData.forEach((el) => {
            count = count + el.complementary;
        });
        const annualComp = this.eventBookingData.find((el) => {
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
     * Add 1 number in selected field
     * @param fieldName Column name
     * @param rowIndex index of selected Row
     */
    addNumber(fieldName, rowIndex) {
        if (fieldName === 'complementary') {
            if (this.eventBookingData[rowIndex].complimentaryTicketsAnnual) {
                this.eventBookingData[rowIndex].complementary = Number(this.eventBookingData[rowIndex].complementary) + 1;
                this.annualComplementary = this.annualComplementary - 1;
                this.checkComplementary();
            } else {
                //if(this.memberShipCategory.reservedStadiumSeats <=  this.eventBookingData[rowIndex][fieldName])
                this.eventBookingData[rowIndex].complementary =
                    Number(this.eventBookingData[rowIndex].complementary) + 1;
            }
        } else {
            //if(this.memberShipCategory.reservedStadiumSeats <=  this.eventBookingData[rowIndex][fieldName])
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
            if (this.eventBookingData[rowIndex].complimentaryTicketsAnnual) {
                this.annualComplementary = this.annualComplementary + 1;
                this.checkComplementary();
            }
        }
        this.updateSessionArray();
    }

    /**
     * update session storage array after changing
     */
    updateSessionArray() {
        // if (this.selectedStadium === 'club') {
        //   sessionStorage.setItem('clubEvents', JSON.stringify(this.eventBookingData));
        // } else {
        sessionStorage.setItem('stadiumEvents', JSON.stringify(this.eventBookingData));
        // }
        this.payableAmount();
    }

    /**
     * calculate payable amount
     */
    payableAmount() {
        this.pay = this.getPayableAmount(this.stadiumEvents);
        this.initialPayAmount = this.getInitialPayableAmount(this.stadiumEvents);
        this.isEligibleToBuy();
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
                (evenData.complementary - (evenData.purchasedComplimentryTickets ? evenData.purchasedComplimentryTickets : 0)) : 0);
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
     * get unlinked family number
     */
    getUnlinkedFamily(eventData, isInitial?) {
        let newFamily = 0;
        // for (const family of eventData.familyLinking) {
        //   if ((eventData.linkedFamilyMemberNo && eventData.linkedFamilyMemberNo.indexOf(family) < 0) || !eventData.linkedFamilyMemberNo) {
        //     newFamily.push(family);
        //   }
        // }
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
     * paymentRedirection
     */
    paymentRedirection() {
        this.appService.showLoader(true);
        const team = [];
        const eventPurchasedData = [];
        let totalTicket = 0;
        const eventLists = this.stadiumEvents;
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
        sessionStorage.setItem('stadiumEvents', JSON.stringify(this.eventBookingData));
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
            if ((el.day && el.day === this.familyEventDay && el.id === this.familyEventId) ||
                el.id === this.familyEventId && !el.day) {
                return el;
            }
        });
        const eventDay = this.stadiumEvents[eventData].day ? this.stadiumEvents[eventData].day : 1;
        if (this.stadiumEvents[eventData].familyLinking.indexOf(memberNumber) > -1) {
            const msgData = {
                type: 'error',
                msg: 'Member already Linked',
            };
            this.appService.changeToastMessage(msgData);
            return;

        }
        this.appService.showLoader(true);
        this.bookingService.validateFamily(memberNumber, this.familyEventId, eventDay).subscribe((response: any) => {
                if (response.data && this.familyData.indexOf(memberNumber) < 0) {
                    this.familyLinked.push({
                        member: memberNumber,
                        memberTicketPrice: response.data.memberTicketPrice,
                        memberTicketDiscountedPrice: response.data.memberTicketDiscountedPrice
                    });
                    this.familyData.push(memberNumber);
                    this.familyNumber = '';
                    this.stadiumEvents[eventData].familyLinked = this.familyLinked;
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
                if (this.stadiumEvents[eventData].remainingSeats === this.stadiumEvents[eventData].totalMemberTickets +
                this.stadiumEvents[eventData].totalGuestTickets + this.stadiumEvents[eventData].totalChildTickets
                + this.stadiumEvents[eventData].complementary
                + this.stadiumEvents[eventData].familyLinking.length -
                this.stadiumEvents[eventData].purchasedTickets ?
                    (this.stadiumEvents[eventData].purchasedMemberTickets +
                        this.stadiumEvents[eventData].purchasedGuestTickets +
                        this.stadiumEvents[eventData].purchasedChildTickets +
                        this.stadiumEvents[eventData].purchasedDininigTickets +
                        this.stadiumEvents[eventData].purchasedComplimentryTickets) : 0) {
                    this.familyLinkingPopup = false;
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
     * remove family linking
     * @param rowIndex index
     */
    removeLinking(rowIndex) {
        const eventIndex = this.eventBookingData.findIndex((el) => {
            if ((el.day && el.day === this.familyEventDay && el.id === this.familyEventId) ||
                el.id === this.familyEventId && !el.day) {
                return el;
            }
        });
        this.eventBookingData[eventIndex].familyLinking.splice(rowIndex, 1);
        this.eventBookingData[eventIndex].familyLinked.splice(rowIndex, 1);
        this.familyData = this.eventBookingData[eventIndex].familyLinking;
        this.payableAmount();
    }

    /**
     * add family
     * @param rowData selected row's data
     */
    addFamily(rowIndex) {
        const purchased = this.eventBookingData[rowIndex].purchasedTickets ?
            (this.eventBookingData[rowIndex].purchasedMemberTickets ? this.eventBookingData[rowIndex].purchasedMemberTickets : 0)
            + (this.eventBookingData[rowIndex].purchasedGuestTickets ? this.eventBookingData[rowIndex].purchasedGuestTickets : 0)
            + (this.eventBookingData[rowIndex].purchasedChildTickets ? this.eventBookingData[rowIndex].purchasedChildTickets : 0)
            + (this.eventBookingData[rowIndex].purchasedComplimentryTickets ?
            this.eventBookingData[rowIndex].purchasedComplimentryTickets : 0)
            + (this.eventBookingData[rowIndex].linkedFamilyMemberNo ?
            this.eventBookingData[rowIndex].linkedFamilyMemberNo.length : 0) : 0;
        const newTicket = this.eventBookingData[rowIndex].totalMemberTickets
            + this.eventBookingData[rowIndex].totalGuestTickets +
            this.eventBookingData[rowIndex].totalChildTickets +
            this.eventBookingData[rowIndex].familyLinking.length
            + this.eventBookingData[rowIndex].complementary;
        if (!this.eventBookingData[rowIndex].saleClosed && this.eventBookingData[rowIndex].remainingSeats !== 0 &&
            (this.eventBookingData[rowIndex].remainingSeats !== newTicket - purchased)) {
            this.familyLinkingPopup = true;
            this.familyData = JSON.parse(JSON.stringify(this.eventBookingData[rowIndex].familyLinking ?
                this.eventBookingData[rowIndex].familyLinking : []));
            this.linkedFamily = JSON.parse(JSON.stringify(this.eventBookingData[rowIndex].linkedFamilyMemberNo ?
                this.eventBookingData[rowIndex].linkedFamilyMemberNo : []));
            this.familyEventId = this.eventBookingData[rowIndex].id;
            if (this.eventBookingData[rowIndex].day) {
                this.familyEventDay = this.eventBookingData[rowIndex].day;
            }
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
