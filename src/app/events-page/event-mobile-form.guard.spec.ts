import { TestBed, async, inject } from '@angular/core/testing';

import { EventMobileFormGuard } from './event-mobile-form.guard';

describe('EventMobileFormGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventMobileFormGuard]
    });
  });

  it('should ...', inject([EventMobileFormGuard], (guard: EventMobileFormGuard) => {
    expect(guard).toBeTruthy();
  }));
});
