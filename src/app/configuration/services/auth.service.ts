import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrls, Base, Redirects } from '../configuration.component';
import { CookieService } from 'ngx-cookie-service';
import { AdminService } from './pages/admin.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  base = new Base();

  private baseUrl = this.base.baseUrl;
  private suffixUrl = this.base.suffixUrl;

  private apiUrlLogin = `${this.baseUrl}/${this.suffixUrl}/login`;
  private apiUrlLogOut = `${this.baseUrl}/${this.suffixUrl}/logout`;
  private tokenKey = 'auth_token';

  public data: any;

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  login(emailOrPhone: string, password: string): Observable<any> {
    let body;
    if (emailOrPhone.includes('@')) {
      // user is logging in with an email
      body = { email: emailOrPhone, password };
    } else {
      // user is logging in with a phone number
      body = { phone: emailOrPhone, password };
    }

    // this.cookieService.set('bin_digit', this.hexService.stringToHex(password));

    const headers = new HttpHeaders().set('Content-Type', ApiUrls.ContentType);

    return this.http.post<any>(this.apiUrlLogin, body, { headers });
  }

  setToken(token: string): void {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + 24 * 60 * 60 * 1000); // Set expiration to 24 hours from now
    const tokenObject = {
      token: token,
      expiration: expirationDate.getTime(),
    };
    localStorage.setItem(this.tokenKey, JSON.stringify(tokenObject));
  }

  getToken(): any {
    const tokenString = localStorage.getItem(this.tokenKey);
    if (tokenString) {
      const tokenObject = JSON.parse(tokenString);
      const expiration = tokenObject.expiration;
      if (expiration && new Date().getTime() < expiration) {
        //console.log(tokenObject.token.toString());
        return tokenObject.token.toString();
      } else {
        this.clearToken();
      }
    }
    return null;
  }

  clearToken(): void {
    this.cookieService.delete(this.tokenKey);
    localStorage.removeItem(this.tokenKey);
  }

  logout(): void {
    const headers = {
      Authorization: 'Bearer ' + this.getToken(),
    };
    this.http.post(`${this.apiUrlLogOut}`, {}, { headers }).subscribe(() => {
      this.clearToken();
      this.cookieService.deleteAll();
      localStorage.clear();

      if (this.baseUrl == Redirects.localServerUrl) {
        window.location.href = Redirects.localUserUrl;
      } else {
        window.location.href = Redirects.deployUserUrl;
      }
    });
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
