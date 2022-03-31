import { TestBed } from '@angular/core/testing';

import { BookingMenuClubService } from './event-booking.service';

describe('CorMenuClubService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BookingMenuClubService = TestBed.get(BookingMenuClubService);
    expect(service).toBeTruthy();
  });
});
