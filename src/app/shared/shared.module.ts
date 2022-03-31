import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './../header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TableModule } from 'primeng/table';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { ShareService } from './share.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SharedComponent } from './shared.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { GoogleSheetComponent } from './google-sheet/google-sheet.component';
import { DialogModule } from 'primeng/dialog';
@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    SharedComponent,
    GoogleSheetComponent
  ],
  imports: [
    CommonModule,
    TableModule,
    ScrollToModule.forRoot(),
    RouterModule,
    TabsModule.forRoot(),
    ToastModule,
    FormsModule,
    ReactiveFormsModule,
    ProgressSpinnerModule,
    DialogModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    TableModule,
    ScrollToModule,
    RouterModule,
    TabsModule,
    ToastModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ProgressSpinnerModule,
    DialogModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ShareService,
      multi: true
    },
    MessageService,
  ]
})

export class SharedModule { }
