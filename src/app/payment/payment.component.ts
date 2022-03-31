import {Component, OnInit, OnDestroy} from '@angular/core';
import {PaymentService} from './payment.service';
import {Subscription} from 'rxjs';
import {ConfirmationService} from 'primeng/api';
import {AuthService} from '../auth/auth.service';
import {Router, ActivatedRoute} from '@angular/router';
import {MenuItem} from 'primeng/api';
import {AppService} from '../app.service';
import {EventService} from '../events-page/events/event.service';

declare var securePayUI: any;
declare var paypal: any;

@Component({
    selector: 'qcc-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.css'],
    providers: [ConfirmationService],
})

export class PaymentComponent implements OnInit, OnDestroy {
    loader: Subscription;
    userDataSub: Subscription;
    memberShipName: string;
    userAuthData: any;
    user: string;
    isIn: boolean;
    mySecurePayUI;
    token: any;
    paymentDetails: any;
    /** section */
    confirmation = false;
    invoiceData: any = {};
    items: MenuItem[];
    activeIndex = 1;
    totalAmount = 0;
    totalTickets = 0;
    orderId: any;
    discountedAmount: any;
    totalDiscount: number;
    eventPurchasedList: any = [];
    soldOutMsgModal: boolean;
    soldOutMsg: any;
    cardToken: any;
    payPalDetails: any;

    constructor(
        public paymentServices: PaymentService,
        public authService: AuthService,
        public eventService: EventService,
        public appService: AppService,
        public confirmationService: ConfirmationService,
        public activatedRoute: ActivatedRoute,
        public router: Router) {
        this.user = localStorage.getItem('currentUser');
        this.memberShipName = localStorage.getItem('memberShipName');
        this.paymentDetails = JSON.parse(localStorage.getItem('paymentDetails'));
        this.invoiceData.address = {
            state: 'NewSouthWales',
            country: 'Australia'
        };
        this.invoiceData.paymentType = 'card';
    }


    ngOnInit() {

        this.broadcastUserData();
        this.userAuthData = this.eventService.userDetails ? this.eventService.userDetails.adminConfig : {};
        this.items = [
            {label: 'Login'},
            {label: 'Billing Address'},
            {label: 'Paymemt'}
        ];
        this.totalAmount = this.paymentDetails[this.paymentDetails.length - 1].totalAmount;
        this.discountedAmount = this.paymentDetails[this.paymentDetails.length - 1].discountedAmount;
        this.totalTickets = this.paymentDetails[this.paymentDetails.length - 1].totalTickets;
        this.eventPurchasedList = this.paymentDetails[this.paymentDetails.length - 1].eventPurchasedList;

        if (this.router.url === '/payment/Card' || this.router.url === '/payment/PayPal' || this.router.url === '/payment/Invoice') {
            this.activeIndex = 2;
            this.invoiceData.address = JSON.parse(sessionStorage.getItem('userAddress'));
        }

        if (this.router.url === '/payment/Card') {
            this.invoiceData.paymentType = 'creditCard';
            setTimeout(() => {
                this.createCardSection();
            }, 100);
        }

        if (this.router.url === '/payment/Invoice') {
            this.invoiceData.paymentType = 'invoice';
        }

        if (this.router.url === '/payment/PayPal') {
            this.invoiceData.paymentType = 'paypal';
            this.dataToSend();
        }

        if (this.router.url.indexOf('/payment-confirmation') > -1) {
            this.confirmation = true;
            sessionStorage.clear();
            // qb=110&paymentId=PAYID-L2FNSBY1EY90017GL104645E&token=EC-1SN58624RA6785925&PayerID=YCMGLC2R7DFVW
            const payerID: string = this.activatedRoute.snapshot.queryParamMap.get('PayerID');
            const paymentId: string = this.activatedRoute.snapshot.queryParamMap.get('paymentId');
            this.orderId = this.activatedRoute.snapshot.queryParamMap.get('qb');
            if (payerID && paymentId) {
                this.executePayPalPayment(paymentId, payerID);
            }
        }
        this.totalDiscount = this.totalAmount - this.discountedAmount;
    }

    ngOnDestroy() {
        this.userDataSub.unsubscribe();
    }

    /**
     * broadcasted user data
     */
    broadcastUserData() {
        this.userDataSub = this.appService.userSourceState$.subscribe((data: any) => {
            this.userAuthData = data.adminConfig;
        });
    }

    /**
     * To stop inputboxes from accepting negative values
     * @param event value
     */
    validateInt(event) {
        return ((event.charCode <= 13) || (event.charCode >= 48 && event.charCode <= 57)
            || (event.charCode === 46));
    }

    /**
     * trim text box value
     * @param event input value
     */
    trimValue(event) {
        this.invoiceData.address.email = event.target.value.trim();
    }

    /**
     * hamburg button for responsive
     */
    toggleState() {
        const bool = this.isIn;
        this.isIn = bool === false ? true : false;
    }

    /**
     * logout
     */
    logout() {
        this.authService.logoutUser().subscribe((response: any) => {
            localStorage.clear();
            sessionStorage.clear();
            this.router.navigate(['/login']);
        });
    }

    /**
     * creating card UI secure pay
     */
    createCardSection() {
        this.mySecurePayUI = new securePayUI.init({
            containerId: 'securepay-ui-container',
            scriptId: 'securepay-ui-js',
            clientId: '0oaxb9i8P9vQdXTsn3l5',
            merchantCode: '5AR0055',
            card: {
                allowedCardTypes: ['visa', 'mastercard', 'amex', 'diners'],
                showCardIcons: true,
                onCardTypeChange: (cardType) => {
                },
                onBINChange: (cardBIN) => {
                },
                onFormValidityChange: (valid) => {
                },
                onTokeniseSuccess: (tokenisedCard) => {
                    this.token = tokenisedCard.token;
                    this.dataToSend();
                    this.payInvoice();
                    // this.createCardPayment();
                },
                onTokeniseError: (errors) => {
                }
            },
            style: {
                label: {
                    font: {
                        family: 'Arial, Helvetica, sans-serif',
                        size: '1.1rem',
                        color: 'darkblue'
                    }
                },
                input: {
                    font: {
                        family: 'Arial, Helvetica, sans-serif',
                        size: '1.1rem',
                        color: 'darkblue'
                    }
                }
            },
            onLoadComplete() {
            }
        });
    }

    /**
     * creating card payment
     */
    createCardPayment() {
        this.appService.showLoader(true);
        const dataToSend = {
            amount: this.discountedAmount,
            token: this.token,
            paymentId: this.orderId,
        };
        this.paymentServices.createCardPayment(dataToSend).subscribe((response: any) => {
            this.appService.showLoader(false);
            if (response.data.status === 'paid') {
                this.router.navigate([`/payment-confirmation`], {queryParams: {qb: this.orderId}});
            } else {
                this.router.navigate([`/payment-failed`]);
            }
        }, (error) => {
            this.appService.showLoader(false);
            this.router.navigate([`/payment-failed`]);
        });
    }

    /**
     * callback function on tab change
     * @param $event selected tab name
     */
    beforeTabChange($event) {
        this.router.navigate([`/payment/${$event.heading}`]);
    }

    /**
     * create data to validate or buy tickets
     */
    dataToSend() {
        this.paymentDetails = this.paymentDetails.splice(0, this.paymentDetails.length - 1);
        for (const iterator of this.paymentDetails) {
            delete iterator.memberTicketPrice;
            delete iterator.guestTicketPrice;
            delete iterator.pay;
            if (iterator.complimentaryTicketsAnnual) {
                iterator.complimentaryTicketsAnnual = iterator.complementary;
                delete iterator.complimentaryTicketsPerStadiumEvent;
            } else if (iterator.complimentaryTicketsPerStadiumEvent) {
                iterator.complimentaryTicketsPerStadiumEvent = iterator.complementary;
                delete iterator.complimentaryTicketsAnnual;
            } else {
                delete iterator.complimentaryTicketsPerStadiumEvent;
                delete iterator.complimentaryTicketsAnnual;
            }
            delete iterator.complementary;
        }
        this.invoiceData.tickets = this.paymentDetails;
    }

    /**
     * show payment section
     */
    // placeOrder() {
    //   this.appService.showLoader(true);
    //   this.paymentServices.checkTicketStatus(this.invoiceData).subscribe((response: any) => {
    //     this.activeIndex = 2;
    //     setTimeout(() => {
    //       this.createCardSection();
    //     }, 100);
    //     this.appService.showLoader(false);
    //   }, (error) => {
    //     if (error.error.httpStatus === 400) {
    //       this.soldOutMsgModal = true;
    //       this.soldOutMsg = error.error.message;
    //     }
    //     this.appService.showLoader(false);
    //   });

    // }

    /**
     * pay using invoice or book tickets
     */
    payInvoice() {
        this.appService.showLoader(true);
        this.paymentServices.payInvoice(this.invoiceData).subscribe((response1: any) => {
            // this.appService.showLoader(false);
            this.orderId = response1.data.id;
            if (this.router.url === '/payment/Invoice' || this.invoiceData.paymentType === 'complimentrySeats') {
                this.router.navigate([`/payment-confirmation`], {queryParams: {qb: this.orderId}});
            } else if (this.router.url === '/payment/PayPal') {
                this.invoiceData.paymentType = 'paypal';
                const dataToSend = {
                    amount: this.totalAmount,
                    orderId: this.orderId,
                    redirectUrls: {
                        successUrl: `https://qcc.zipsites.com.au/payment-confirmation?qb=${this.orderId}`,
                        cancelUrl: 'https://qcc.zipsites.com.au/payment-failed',
                        // successUrl: `http://localhost:4200/payment-confirmation?qb=${this.orderId}`,
                        // cancelUrl: 'http://localhost:4200/payment-failed',
                    }
                };
                this.paymentServices.initiatePayPal(dataToSend).subscribe((response2: any) => {
                    this.payPalDetails = response2.data;
                    window.location.href = this.payPalDetails.paymentUrl;
                    localStorage.setItem('paypal', JSON.stringify(this.payPalDetails.orderId));
                }, (error) => {
                });
            } else if (this.invoiceData.paymentType !== 'complimentrySeats') {
                this.createCardPayment();
            }
        }, (error) => {
            this.appService.showLoader(false);
            this.router.navigate(['/payment-failed']);
        });
    }

    /**
     * inititate paypal
     */
    initiatePayPalPayment() {
        this.appService.showLoader(true);
        this.invoiceData.paymentType = 'paypal';
        this.payInvoice();
    }

    /**
     * validate tickets available or not
     */
    validateTickets() {
        this.dataToSend();
        this.appService.showLoader(true);
        this.paymentServices.checkTicketStatus(this.invoiceData).subscribe((response: any) => {
            if (this.totalAmount !== 0) {
                this.router.navigate(['payment/Card']);
                sessionStorage.setItem('userAddress', JSON.stringify(this.invoiceData.address));
            } else {
                this.invoiceData.paymentType = 'complimentrySeats';
                this.payInvoice();
            }
            this.appService.showLoader(false);
        }, (error) => {
            if (error.error.httpStatus === 400 && error.error.message) {
                this.soldOutMsgModal = true;
                this.soldOutMsg = error.error.message;
            }
            this.appService.showLoader(false);
        });

    }

    /**
     * execute paypal
     */
    executePayPalPayment(paymentID, payerID) {
        this.appService.showLoader(true);
        const order = JSON.parse(localStorage.getItem('paypal'));
        const dataToSend = {
            payerId: payerID,
            paymentId: this.orderId,
            orderId: order,
            amount: this.discountedAmount,
        };
        this.paymentServices.executePayPal(dataToSend, order).subscribe((response: any) => {
            if (this.totalAmount !== 0) {
                this.appService.showLoader(true);
                // this.router.navigate(['payment/Card']);
                // sessionStorage.setItem('userAddress', JSON.stringify(this.invoiceData.address));
                setTimeout(() => {
                    this.appService.showLoader(false);
                    this.router.navigate(['events']);
                }, 3000);
            } else {
                this.invoiceData.paymentType = 'complimentrySeats';
                this.payInvoice();
            }
            this.appService.showLoader(false);
        }, (error) => {
            if (error.error.httpStatus === 400 && error.error.message) {
                this.soldOutMsgModal = true;
                this.soldOutMsg = error.error.message;
            }
            this.appService.showLoader(false);
        });
    }
}
