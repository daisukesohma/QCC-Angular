import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../../app.service';
import { ShareService } from '../share.service';
import { HttpHeaders } from '@angular/common/http';
import { ServerApis } from 'src/app/api.constants';

@Component({
  selector: 'qcc-google-sheet',
  templateUrl: './google-sheet.component.html',
  styleUrls: ['./google-sheet.component.css']
})
export class GoogleSheetComponent implements OnInit {

  constructor(
    public activatedRoute: ActivatedRoute,
    public sharedService: ShareService,
    public router: Router,
    public appService: AppService) { }

  ngOnInit() {
    this.appService.showLoader(true);
    const sheetParam = window.location.href.split('?');
    this.callbackGoogleSheet(sheetParam[1]);
  }

  callbackGoogleSheet(sheetParam) {
    this.googleSheet(sheetParam).subscribe((response: any) => {
      this.appService.showLoader(false);
      this.router.navigate(['/']);
    });
  }

  googleSheet(sheetParam) {
    const url = `${ServerApis.sheetGoogle}?${sheetParam}`;
    return this.sharedService.sheet(url);
  }

}
