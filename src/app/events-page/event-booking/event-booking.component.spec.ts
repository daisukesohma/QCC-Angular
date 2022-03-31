import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorpMemClubComponent } from './corp-mem-club.component';

describe('CorpMemClubComponent', () => {
  let component: CorpMemClubComponent;
  let fixture: ComponentFixture<CorpMemClubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorpMemClubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorpMemClubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
