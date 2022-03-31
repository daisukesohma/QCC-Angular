import { TestBed, async, inject } from '@angular/core/testing';

import { AuthEventsPageGuard } from './auth-events-page.guard';

describe('AuthEventsPageGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthEventsPageGuard]
    });
  });

  it('should ...', inject([AuthEventsPageGuard], (guard: AuthEventsPageGuard) => {
    expect(guard).toBeTruthy();
  }));
});
