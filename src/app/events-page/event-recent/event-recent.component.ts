import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { EventService } from '../events/event.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'qcc-event-recent',
  templateUrl: './event-recent.component.html',
  styleUrls: ['./event-recent.component.css']
})
export class EventRecentComponent implements OnInit {
  upCommingEventsData: any = [];
  eventId: string;
  @Output() updatedEventID = new EventEmitter<any>();

  constructor(
    public eventService: EventService,
    public activatedRoute: ActivatedRoute,
    public router: Router) { }

  ngOnInit() {
    this.eventId = this.activatedRoute.snapshot.paramMap.get('id');
    this.getUpCommingEventsList();
  }
  getUpCommingEventsList(): void {
    this.eventService.getRelatedUpcomingLists(this.eventId).subscribe((response: any) => {
      const upCommingEventsData = response.data;
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < upCommingEventsData.length; i++) {
        upCommingEventsData[i].startDate = this.date(upCommingEventsData[i].startDate);
      }
      this.upCommingEventsData = upCommingEventsData;
    }, (error) => {
    });
  }

  date(startDate) {
    const a = startDate.split('/');
    const b = `${a[2]}/${a[1]}/${a[0]}`;
    const c = new Date(b);
    return c;
  }

  /**
   * update event
   */
  updateEvent(eventId) {
    this.updatedEventID.emit(eventId);
    this.eventId = eventId;
    window.scrollTo(0, 0);
    this.getUpCommingEventsList();
  }
}
