import { TestBed } from '@angular/core/testing';

import { EventBookingMobileService } from './event-booking-mobile.service';

describe('EventBookingMobileService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventBookingMobileService = TestBed.get(EventBookingMobileService);
    expect(service).toBeTruthy();
  });
});
