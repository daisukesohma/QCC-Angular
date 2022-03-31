import { Component, OnInit, Input, HostListener, ViewChild } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
import { Subscription } from 'rxjs';
import { EventService } from '../events-page/events/event.service';

@Component({
  selector: 'QCC-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userDataSub: Subscription;
  userDisplayName = '';
  userDisplaylastName = '';
  firstCharacter: string;
  lastCharacter: string;
  navbarOpen = false;
  src = 'assets/SVG/qcc-logo-white.svg';
  @Input() eventsRef: any;
  @Input() aflRef: any;
  @Input() cricketRef: any;
  @Input() aflData: any;
  @Input() cricketData: any;
  @ViewChild('insideElement', { static: false }) insideElement: any;
  sticky = false;
  isIn = false;
  userLoggedIn: boolean = false;

  constructor(
    public authService: AuthService,
    public router: Router,
    public appService: AppService,
    public eventService: EventService,
  ) {

  }

  ngOnInit() {
    if (this.router.url !== '/events') {
      this.sticky = true;
      this.src = 'assets/SVG/Dummy-Logo12.svg';
    }
    this.checkUserLogin();
  }

  checkUserLogin() {
    if (this.eventService.userDetails && this.eventService.userDetails.memberCategory) {
      this.userLoggedIn = true;
    } else {
      this.userLoggedIn = false;
    }
    this.userDataSub = this.appService.userSourceState$.subscribe((data: any) => {
      if (data.memberCategory) {
        this.userLoggedIn = true;
      } else {
        this.userLoggedIn = false;
      }
    });
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {
    if (window.innerWidth <= 768) {
      const clickedInside = this.insideElement.nativeElement.contains(targetElement);
      if (!clickedInside) {
        this.isIn = false;
      }
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.router.url === '/events') {
      const offsetTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      if (offsetTop < 15) {
        this.sticky = false;
        this.src = 'assets/SVG/qcc-logo-white.svg';
      } else {
        this.sticky = true;
        this.src = 'assets/SVG/Dummy-Logo12.svg';
      }
    } else {
      this.sticky = true;
      this.src = 'assets/SVG/Dummy-Logo12.svg';
    }
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  toggleState() {
    const bool = this.isIn;
    this.isIn = bool === false ? true : false;
  }

  reloadPage() {
    this.appService.showLoader(true);
    setTimeout(() => {
      this.appService.showLoader(false);
    }, 1000);
  }

  logout() {
    this.authService.logoutUser().subscribe((response: any) => {
      localStorage.clear();
      sessionStorage.clear();
      this.router.navigate(['/login']);
    });
  }
}
