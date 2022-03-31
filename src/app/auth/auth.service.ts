import { Injectable } from '@angular/core';
import { LoginModal } from './login/loginModal';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { ServerApis } from '../api.constants';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { RegisterModal } from './register/registerModal';
import { ChangePasswordModel } from './change-password/change-password.model';
import { catchError } from 'rxjs/operators';
@Injectable()
export class AuthService {
  authorizedToken: string;
  authorizedHeader: HttpHeaders;

  constructor(
    public httpClient: HttpClient,
    public router: Router,
    public route: ActivatedRoute) { 
      this.getAuthToken();
    }

  getAuthToken() {
    const authToken = localStorage.getItem('userToken');
    this.authorizedToken = authToken ? `Bearer ${authToken}` : '';
    this.authorizedHeader = new HttpHeaders()
      .set('Authorization', this.authorizedToken)
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Methods', 'GET, POST, PUT');
  }

  loginUser(loginUser: LoginModal): Observable<any> {
    return this.httpClient.post(ServerApis.userLoginURL, loginUser);
  }

  logoutUser() {
    this.getAuthToken();
    return this.httpClient.get(ServerApis.userLogoutURL);
  }

  registeruser(registerUser: RegisterModal): Observable<any> {
    return this.httpClient.post(ServerApis.userRegisterURL, registerUser);
  }

  resetPassword(username: string): Observable<any> {
    return this.httpClient.get<any>(`${ServerApis.getForgetPasswordURL}?username=${username}`);
  }
  changePassword(changePassword: ChangePasswordModel): Observable<any> {
    const id = this.route.snapshot.queryParamMap.get('id');
    const token = this.route.snapshot.queryParamMap.get('token');
    changePassword.token = token;
    return this.httpClient.post<any>(`${ServerApis.changePasswordURL}?id=${id}&token=${token}`, changePassword);
  }

  getReciprocalClubs(): Observable<any> {
    const getReciprocalClubs = ServerApis.getReciprocalClubUrl;
    return this.httpClient.get(getReciprocalClubs);
  }
}
