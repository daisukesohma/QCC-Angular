import { NgModule } from '@angular/core';
import { SharedModule } from './../shared/shared.module';
import { EventsComponent } from './events/events.component';
import { EventsDetailComponent } from './events-detail/events-detail.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { EventService } from './events/event.service';
import { EventRecentComponent } from './event-recent/event-recent.component';
import { CorpMemClubComponent } from './event-booking/event-booking.component';
import { CorpMemClubComponentNew } from './event-booking-new-design/event-booking.component';
// import { DialogModule } from 'primeng/dialog';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { EventsListComponent } from './event-booking/mobile-app/events-list/events-list.component';
import { EventTicketsComponent } from './event-booking/mobile-app/event-tickets/event-tickets.component';
import { EventBookingService } from './event-booking/event-booking.service';


@NgModule({
  declarations: [
    EventsComponent,
    EventsDetailComponent,
    CorpMemClubComponent,
    CorpMemClubComponentNew,
    EventRecentComponent,
    EventsListComponent,
    EventTicketsComponent,
  ],
  imports: [
    SharedModule,
    CarouselModule,
    // DialogModule,
    TabsModule.forRoot(),
  ],
  providers: [EventService, EventBookingService],

  exports: [
  ]
})

export class EventsPageModule { }
