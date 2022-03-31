import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventRecentComponent } from './event-recent.component';

describe('EventRecentComponent', () => {
  let component: EventRecentComponent;
  let fixture: ComponentFixture<EventRecentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventRecentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventRecentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
