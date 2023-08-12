import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Base, Redirects } from '../configuration.component';
import { AuthService } from './auth.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  base = new Base();
  auth = new AuthService(this.http, this.cookieService);
  private baseUrl = this.base.baseUrl;
  private suffixUrl = this.base.suffixUrl;
  private apiUserUrl = `${this.baseUrl}/${this.suffixUrl}/user`;

  constructor(private http: HttpClient, private cookieService: CookieService,) {}


  getUserData(): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );
    return this.http.get<any>(this.apiUserUrl, { headers });
  }
}
