import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleSheetComponent } from './google-sheet.component';

describe('GoogleSheetComponent', () => {
  let component: GoogleSheetComponent;
  let fixture: ComponentFixture<GoogleSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
