import { Injectable } from '@angular/core';
import { ShareService } from '../../shared/share.service';
import { ServerApis } from '../../api.constants';

@Injectable()
export class EventBookingService {

  constructor(public sharedService: ShareService) { }

  getClubEvents() {
    const clubEventUrl = ServerApis.clubEvents;
    return this.sharedService.get(clubEventUrl);
  }

  getStadiumEvents(eventId) {
    let clubEventUrl = ServerApis.stadiumEvents;
    if (eventId) {
      clubEventUrl = `${clubEventUrl}?eventId=${eventId}`;
    }
    return this.sharedService.get(clubEventUrl);
  }

  /**
   * Validate family
   */
  validateFamily(memberNumber, eventId) {
    let validateFamilyURL = ServerApis.validateFamily;
    validateFamilyURL = validateFamilyURL.replace('memberno', memberNumber).replace('eventId', eventId);
    return this.sharedService.get(validateFamilyURL);
  }
}
