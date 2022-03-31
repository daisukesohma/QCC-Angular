import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, RouterEvent } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { AppService } from './app.service';
import { MessageService } from 'primeng/api';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { EventService } from './events-page/events/event.service';

@Component({
  selector: 'qcc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'QCC';
  loader: Subscription;
  loading: boolean;
  toastMessage: Subscription;
  message: string;
  userDataSub: Subscription;

  constructor(
    private messageService: MessageService,
    private gtmService: GoogleTagManagerService,
    private router: Router,
    public eventService: EventService,
    public appService: AppService) {
  }

  ngOnInit() {
    this.router.events.subscribe((item: RouterEvent) => {
      if (item instanceof NavigationEnd) {
        const gtmTag = {
          event: 'page',
          pageName: item.url
        };
        this.gtmService.pushTag(gtmTag);
      }
    });
    sessionStorage.clear();
    this.loader = this.appService.loaderState$.subscribe((data: any) => {
      this.loading = data;
    });
    this.toastMessage = this.appService.currentMessage$.subscribe((data: any) => {
      this.showMessage(data);
    });
    // setTimeout(()=> {
    this.broadcastUserData();
    // },10);
  }

  ngOnDestroy() {
    this.loader.unsubscribe();
  }

  /**
   * broadcasted user data
   */
  broadcastUserData() {
    this.userDataSub = this.appService.userSourceState$.subscribe((data: any) => {
      if (!data.memberCategory && !(window.location.href.includes('/event') ||
      window.location.href.includes('/login') || window.location.href.includes('/googleSheet') ||
      window.location.href.includes('/forget') ||  window.location.href.includes('/change') ||
      window.location.href.includes('/register') ||  window.location.href.includes('/detail'))) {
        this.router.navigate(['/login']);
      }
    });
  }

  /**
   * display toast messages
   */
  showMessage(data) {
    this.messageService.add({ severity: data.type, summary: data.msg });
  }
}
