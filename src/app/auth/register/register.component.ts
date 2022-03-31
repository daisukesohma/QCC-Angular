import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { RegisterModal } from './registerModal';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'qcc-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  Error: false;
  invalid = false;
  registerData: any = {};
  emailAlredyExist = false;
  isLoginError = false;
  message: string;
  Submitted = false;
  clubsData: any;
  emailPattern = '[a-zA-Z0-9.-_+-]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,63}';
  phoneNumber = '(\(+61\)|\+61|\(0[1-9]\)|0[1-9])?( ?-?[0-9]){6,9}';

  constructor(
    public authService: AuthService,
    public formbuilder: FormBuilder,
    public router: Router,
    public appService: AppService,
  ) {
    this.registerForm = this.formbuilder.group({});
  }

  ngOnInit() {
    this.getClubs();
    this.FormState();
  }

  FormState(): void {
    this.registerForm = this.formbuilder.group({
      firstName: new FormControl(this.registerData.firstName, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
      lastName: new FormControl(this.registerData.lastName, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
      password: new FormControl(this.registerData.password, [Validators.required]),
      confirmPassword: new FormControl(this.registerData.confirmPassword, [Validators.required]),
      email: new FormControl(this.registerData.email, [Validators.required, Validators.pattern(this.emailPattern)]),
      mobileNumber: new FormControl(this.registerData.mobileNumber, [Validators.required, Validators.pattern('[1-9]{1}[0-9]{6,15}')]),
      membershipDate: new FormControl(this.registerData.membershipDate, [Validators.required]),
      recClubMemberNo: new FormControl(this.registerData.recClubMemberNo),
      reciprocalClubId: new FormControl(this.registerData.reciprocalClubId),
    });
  }

  onSubmit() {
    this.Submitted = true;
    const regDate = new Date(this.registerForm.value.membershipDate);
    const day = regDate.getDate();
    const month = regDate.getMonth() + 1;
    const year = regDate.getFullYear();
    const register = this.registerForm.value;
    register.mobileNumber = `+61-${register.mobileNumber}`;
    register['membershipExiryDate'] = day + '/' + month + '/' + year;
    this.register(register);
  }

  matchPassword() {
    if (this.registerData.confirmPassword) {
      const password = this.registerData.password; // to get value in input tag
      const confirmPassword = this.registerData.confirmPassword; // to get value in input tag
      if (password !== confirmPassword || confirmPassword !== password) {
        this.invalid = true;
      } else {
        this.invalid = false;
      }
    }
  }

  register(registerUser: RegisterModal) {
    if (registerUser.reciprocalClubId === 'undefined') {
      delete registerUser.reciprocalClubId;
      delete registerUser.recClubMemberNo;
    }
    this.authService.registeruser(registerUser).subscribe((data: any) => {
      this.router.navigate(['/login']);
    }, (error) => {
      const msgData = {
        type: 'error',
        msg: error.error.message,
      };
      this.appService.changeToastMessage(msgData);
      if (error.error.message === '409 Username already exist') {
        this.emailAlredyExist = true;
        setTimeout(() => {
          this.emailAlredyExist = false;
        }, 6000);
      }
    });
  }

  /**
   * get lists of reciprocals
   */
  getClubs(): void {
    this.authService.getReciprocalClubs().subscribe((response) => {
      this.clubsData = response.data;
    }, (error) => {
    });
  }

}
