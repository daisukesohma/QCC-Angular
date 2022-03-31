import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AppService } from '../../app.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'qcc-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  column = 'club';
  event: Subscription;
  stadiumEvent = true;
  // @Output() selectedSideBar = new EventEmitter<any>();
  constructor(public appService: AppService, public router: Router) {
   }

  ngOnInit() {
    if (this.router.url === '/club-event') {
      this.column = 'club';
    } else {
      this.column = 'stadium';
    }
  }

  /**
   * To send message to Department component related to Department Add or Update
   */
  departmentMessages(): void {
    const eventData = {
      column: this.column,
      stadiumEvent: this.stadiumEvent
    };
    // this.selectedSideBar.emit(eventData);
    if (!this.stadiumEvent) {
      this.column = 'club';
    }
  }

}
