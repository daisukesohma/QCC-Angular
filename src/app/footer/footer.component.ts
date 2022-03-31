import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'qcc-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  currentYear = new Date().getFullYear();
  @Input() eventsRef: any;
  @Input() aflRef: any;
  @Input() cricketRef: any;
  @Input() aflData: any;
  @Input() cricketData: any;
  @Input() upCommingEventsData: any;

  constructor() { }

  ngOnInit() {
  }

}
