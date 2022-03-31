import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ShareService } from '../shared/share.service';
import { ServerApis } from '../api.constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class PaymentService {
  authorizedHeader: HttpHeaders;

  constructor(public shareService: ShareService, private http: HttpClient) { }

  /**
   * check selected ticket availability to purchase
   */
  checkTicketStatus(invoiceData) {
    const url = ServerApis.ticketStatus;
    return this.shareService.post(url, invoiceData);
  }

  /**
   * to pay by invoice
   */
  payInvoice(invoiceData) {
    const paymentUrl = ServerApis.paymentUrl;
    return this.shareService.post(paymentUrl, invoiceData);
  }

  /**
   * get card payment done
   */
  createCardPayment(cardData) {
    const cardPaymentUrl = ServerApis.cardPayment;
    return this.shareService.post(cardPaymentUrl, cardData);
  }

  /**
   * initiate paypal
   */
  initiatePayPal(data) {
    const cardPaymentUrl = ServerApis.payPalPayment;
    return this.shareService.post(cardPaymentUrl, data);
  }

  /**
   * execute paypal
   */
  executePayPal(data, orderId) {
    let paypalPaymentUrl = ServerApis.payPalExecutePayment;
    paypalPaymentUrl = paypalPaymentUrl.replace('orderId', orderId);
    return this.shareService.post(paypalPaymentUrl, data);
  }
}
