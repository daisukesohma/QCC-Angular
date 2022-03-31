import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { EventsComponent } from './events-page/events/events.component';
import { EventsDetailComponent } from './events-page/events-detail/events-detail.component';
import { EventRecentComponent } from './events-page/event-recent/event-recent.component';
import { CorpMemClubComponent } from './events-page/event-booking/event-booking.component';
import { CorpMemClubComponentNew } from './events-page/event-booking-new-design/event-booking.component';
import { PaymentComponent } from './payment/payment.component';
import { SharedComponent } from './shared/shared.component';
import { EventsListComponent } from './events-page/event-booking/mobile-app/events-list/events-list.component';
import { AuthEventsPageGuard } from './events-page/auth-events-page.guard';
import { EventTicketsComponent } from './events-page/event-booking/mobile-app/event-tickets/event-tickets.component';
import { ForgetPasswordComponent } from './auth/forget-password/forget-password.component';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';
import { RegisterComponent } from './auth/register/register.component';
import { EventMobileFormGuard } from './events-page/event-mobile-form.guard';
import { GoogleSheetComponent } from './shared/google-sheet/google-sheet.component';
import { AuthLoginGuard } from './shared/auth-login.guard';
import { PaymentFailedComponent } from './payment/payment-failed/payment-failed.component';


const routes: Routes = [
  {
    path: '',
    component: SharedComponent,
    children: [
      {
        path: 'events',
        component: EventsComponent,
        // canActivate: [AuthLoginGuard],
      },
      {
        path: 'events-detail/:id',
        component: EventsDetailComponent,
        // canActivate: [AuthLoginGuard],
      },
      {
        path: 'event-recent',
        component: EventRecentComponent,
        // canActivate: [AuthLoginGuard],
      },
      {
        path: 'stadium-event',
        component: CorpMemClubComponent,
        canActivate: [AuthEventsPageGuard],
      },
      {
        path: 'stadium-event-2',
        component: CorpMemClubComponentNew,
        // canActivate: [AuthLoginGuard],
      },
      {
        path: 'stadium-event/:id',
        component: CorpMemClubComponent,
        canActivate: [AuthEventsPageGuard],
      },
      {
        path: 'club-event',
        component: CorpMemClubComponent,
        canActivate: [AuthEventsPageGuard],
      },
      {
        path: 'event-booking/mobile',
        component: EventsListComponent,
      },
      {
        path: 'event-booking/tickets/mobile',
        component: EventTicketsComponent
      },
      {
        path: 'event-booking/tickets/mobile/stadium/:id',
        component: EventTicketsComponent,
        // canActivate: [EventMobileFormGuard],
      },
      {
        path: 'order-details',
        component: PaymentComponent,
        canActivate: [AuthLoginGuard],
      },
      {
        path: 'payment/Card',
        component: PaymentComponent,
        canActivate: [AuthLoginGuard],
      },
      {
        path: 'payment/PayPal',
        component: PaymentComponent,
        canActivate: [AuthLoginGuard]
      },
      {
        path: 'payment/Invoice',
        component: PaymentComponent,
        canActivate: [AuthLoginGuard],
      },
      {
        path: 'payment-confirmation',
        component: PaymentComponent,
      },
      {
        path: 'payment-failed',
        component: PaymentFailedComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/events'
      },
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'forget-password', component: ForgetPasswordComponent },
  {
    path: 'change-password', component: ChangePasswordComponent, data: {
      routePath: 'change-password',
    }
  },
  {
    path: 'googleSheet',
    component: GoogleSheetComponent
  },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: 'events', pathMatch: 'full' },

];

export const routing = RouterModule.forRoot(routes);
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
