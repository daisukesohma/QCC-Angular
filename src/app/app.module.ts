import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { EventsPageModule } from './events-page/events-page.module';
import { AuthModule } from './auth/auth.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from './auth/auth.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { RouterModule } from '@angular/router';
import { AppService } from './app.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { ShareService } from './shared/share.service';
import { EventService } from './events-page/events/event.service';
import { PaymentComponent } from './payment/payment.component';
import { PaymentService } from './payment/payment.service';
import { MenuModule } from 'primeng/menu';
import { StepsModule } from 'primeng/steps';
import { AuthEventsPageGuard } from './events-page/auth-events-page.guard';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { EventMobileFormGuard } from './events-page/event-mobile-form.guard';
import { AuthLoginGuard } from './shared/auth-login.guard';
import { PaymentFailedComponent } from './payment/payment-failed/payment-failed.component';

// import { CarouselModule } from 'ngx-owl-carousel-o';

@NgModule({
  declarations: [
    AppComponent,
    PaymentComponent,
    PaymentFailedComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    SharedModule,
    EventsPageModule,
    AuthModule,
    HttpClientModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    StepsModule,
  ],
  providers: [
    AuthService,
    AppService,
    ShareService,
    PaymentService,
    AuthEventsPageGuard,
    EventMobileFormGuard,
    AuthLoginGuard,
    {provide: 'googleTagManagerId', useValue: 'GTM-NM2VTPX'},
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
