import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServerApis } from '../../api.constants';
import { ShareService } from '../../shared/share.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class EventService {
  userDetails: any;

  constructor(public shareService: ShareService) { }

  getAfl(eventType): Observable<any> {
    let getEventUrl = ServerApis.eventList;
    getEventUrl = `${getEventUrl}/${eventType}`;
    return this.shareService.get(getEventUrl);
  }

  getUpcommingEvent(): Observable<any> {
    const getUpcommingEvent = ServerApis.upCommingEventList;
    return this.shareService.get(getUpcommingEvent);
  }

  getRelatedUpcomingLists(eventId) {
    let getUpcommingEvent = ServerApis.relatedUpcomingEvent;
    getUpcommingEvent = getUpcommingEvent.replace('eventId', eventId);
    return this.shareService.get(getUpcommingEvent);
  }

  detailUpcommingEvents(eventsId): Observable<any> {
    let url = ServerApis.detailEvent;
    url = url.replace(':eventsId', eventsId);
    return this.shareService.get(url);
  }

  /**
   * Fetch Fixture lists
   */
  getFixtureLists() {
    const fixtureListsUrl = ServerApis.fixtureLists;
    // return this.shareService.get(fixtureListsUrl);
    return this.shareService.get(fixtureListsUrl).pipe(
      tap(
        (data: any) => {
          this.userDetails = data.data;
        },
        (error) => { },
      ),
    );
  }
}
