import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { ChangePasswordModel } from './change-password.model';

@Component({
  selector: 'QCC-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: any;
  id: any;
  token: any;
  message: string;
  error = false;
  changePasswordSubscription: Subscription;

  constructor(private route: ActivatedRoute,
              private formbuilder: FormBuilder,
              private authService: AuthService,
              private router: Router) {
                this.changePasswordForm = this.formbuilder.group({});
               }

  ngOnInit() {
    this.setFormState();
    this.changePasswordForm.id = this.route.snapshot.queryParamMap.get('id');
    this.changePasswordForm.token = this.route.snapshot.queryParamMap.get('token');
  }

  setFormState(): void {
    this.changePasswordForm = this.formbuilder.group({
      password: new FormControl(this.changePasswordForm.password, [Validators.required]),
      confirmPassword: new FormControl(this.changePasswordForm.confirmPassword, [Validators.required]),
    });
  }

  changePassword(changePassword: ChangePasswordModel) {
    const login = this.changePasswordForm.value;
    this.changePasswordSubscription = this.authService.changePassword(login).subscribe((data) => {
      this.router.navigate(['/login']);
    }, error => {
    });
  }

  ngOnDestroy(): void {
    this.changePasswordSubscription && this.changePasswordSubscription.unsubscribe();
    }


}
