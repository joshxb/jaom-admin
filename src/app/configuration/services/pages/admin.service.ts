import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Base, Redirects } from '../../configuration.component';
import { AuthService } from '../auth.service';
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
  private apiUserHistoryUrl = `${this.baseUrl}/${this.suffixUrl}/history`;

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  getUserData(): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );
    return this.http.get<any>(this.apiUserUrl, { headers });
  }

  getUserCounts(): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );
    return this.http.get<any>(this.apiUserUrl + 's/count', { headers });
  }

  countUsersByStatus() {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );
    return this.http.get<any>(this.apiUserUrl + 's/status', { headers });
  }

  getUserHistoryData(page: number): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );
    return this.http.get<any>(`${this.apiUserHistoryUrl}/all?page=${page}`, { headers });
  }

  deleteUserHistory(id : number): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );
    return this.http.delete<any>(`${this.apiUserHistoryUrl}/${id}`, { headers });
  }
}
