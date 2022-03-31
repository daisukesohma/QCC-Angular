import { environment } from './../environments/environment';

export const ServerApis = {

  // =========================== Login ========================================
  userLoginURL: `${environment.url}/api/v1/user/login`,
  userLogoutURL: `${environment.url}/api/v1/admin/logout`,

  // =========================== Register ========================================
  userRegisterURL: `${environment.url}/api/v1/user/register`,

  // =========================== Forget Password ========================================
  getForgetPasswordURL: `${environment.url}/api/v1/forgetPassword`,

  // =========================== Change Password ========================================
  changePasswordURL: `${environment.url}/api/v1/forgetPassword`,

  // =========================== AFL Event List ========================================
  eventList: `${environment.url}/api/v1/events`,

  // =========================== Upcomming Event List ========================================
  upCommingEventList: `${environment.url}/api/v1/events/upcomming`,
  relatedUpcomingEvent: `${environment.url}/api/v1/events/eventId/related`,

  // ============================Detail Event ========================================
  detailEvent: `${environment.url}/api/v1/events/:eventsId`,

  fixtureLists: `${environment.url}/api/v1/adminConfig/user`,
  clubEvents: `${environment.url}/api/v1/events/club`,
  stadiumEvents: `${environment.url}/api/v1/events/stadium`,
  validateFamily: `${environment.url}/api/v1/events/eventId/eventDay/familyLinking/memberno`,
  paymentConfigURL: `${environment.paymentGatewayURL}/v2/payments`,
  paymentUrl: `${environment.url}/api/v1/payment`,
  cardPayment: `${environment.url}/api/v1/securepay/cardPayment`,
  payPalPayment: `${environment.url}/api/v1/securepay/payPalPayment`,
  payPalExecutePayment: `${environment.url}/api/v1/securepay/orderId/execute`,

  // =========================== Reciprocal club ========================================
  getReciprocalClubUrl: `${environment.url}/api/v1/clubs`,
  sheetGoogle: `${environment.url}/api/v1/sheet/callBack`,

  // =========================== Ticket status ========================================
  ticketStatus: `${environment.url}/api/v1/ticket/validate`
};
