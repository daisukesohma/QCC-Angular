import { Component, OnInit } from '@angular/core';
import { EventService } from '../events-page/events/event.service';
import { AppService } from '../app.service';

@Component({
  selector: 'qcc-shared',
  templateUrl: './shared.component.html',
  styleUrls: ['./shared.component.css']
})
export class SharedComponent implements OnInit {

  constructor(
    public eventService: EventService,
    public appService: AppService) { }

  ngOnInit() {
    this.getFixtureData();
  }

  /**
   * get Fixture lists for tables
   */
  getFixtureData() {
    this.eventService.getFixtureLists().subscribe((response: any) => {
      this.appService.userDetail(response.data);
      if (response.data.memberCategory) {
        localStorage.setItem('userMembership', response.data.memberCategory.name);
      }
    });
  }

}
