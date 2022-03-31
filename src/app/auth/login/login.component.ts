import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../auth.service';
import { LoginModal } from './loginModal';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'qcc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginMessage = undefined;
  loginForm: FormGroup;
  isLoginError = false;
  error = false;
  loginData: any = {};
  message: string;
  Submitted = false;
  emailPattern = '[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  @Output() messageEvent = new EventEmitter<string>();

  constructor(
    public authService: AuthService,
    public formbuilder: FormBuilder,
    public router: Router,
    public appService: AppService
  ) {
    this.loginForm = this.formbuilder.group({});
  }

  ngOnInit() {
    sessionStorage.clear();
    this.setFormState();
    this.loginMessage = undefined;
  }

  setFormState(): void {
    this.loginForm = this.formbuilder.group({
      username: new FormControl(this.loginData.username, [Validators.required]),
      password: new FormControl(this.loginData.password, [Validators.required])
    });

  }

  onSubmit() {
    this.loginMessage = undefined;
    this.Submitted = true;
    const login = this.loginForm.value;
    login.username = login.username.trim();
    this.authService.loginUser(login).subscribe((data) => {
      localStorage.setItem('userToken', data.data.token);
      localStorage.setItem('currentUser', data.data.userDetails.username);
      localStorage.setItem('loggedUser', data.data.userDetails.firstName);
      localStorage.setItem('user', data.data.userDetails.lastName);
      this.router.navigate(['/stadium-event']);
      const msgData = {
        type: 'success',
        msg: 'login successfully',
      };
      this.appService.changeToastMessage(msgData);
    },
      (err) => {
        const msgData = {
          type: 'error',
          msg: err.error.message,
        };
        this.loginMessage = err.error.message;
        // /this.appService.changeToastMessage(msgData);
      });
  }

  isLoggedIn() {
    if (localStorage.getItem('currentUser')) {
      return true;
    }
    return false;
  }

}




