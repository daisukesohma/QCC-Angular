import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'QCC-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  forgetPasswordSubscription: Subscription;
  forgetPasswordForm: any;
  showMsg = false;
  isReciprocalUser = false;

  constructor(
    private authService: AuthService,
    private appService: AppService,
    private formBuilder: FormBuilder) {
    this.forgetPasswordForm = this.formBuilder.group({});
  }

  ngOnInit() {
    this.setFormState();
  }

  setFormState(): void {
    this.forgetPasswordForm = this.formBuilder.group({
      username: ['', [Validators.required]],
    });
  }

  resetPassword(loginForm) {
    this.forgetPasswordSubscription = this.authService.resetPassword(this.forgetPasswordForm.username).subscribe((res) => {
      this.showMsg = true;
      this.isReciprocalUser = res.data;
    }, (error) => {
      const msgData = {
        type: 'error',
        msg: error.error.message,
      };
      this.appService.changeToastMessage(msgData);
    });
  }

  ngOnDestroy(): void {
    this.forgetPasswordSubscription && this.forgetPasswordSubscription.unsubscribe();
  }
}
