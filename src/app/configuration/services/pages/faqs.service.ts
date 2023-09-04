import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Base } from '../../configuration.component';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class FaqsService {
  base = new Base();
  auth = new AuthService(this.http, this.cookieService);
  private baseUrl = this.base.baseUrl;
  private suffixUrl = this.base.suffixUrl;
  private apiFaqsURL = `${this.baseUrl}/${this.suffixUrl}/faqs`;

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  showAllFAQS(): Observable<any> {
    const endpoint = this.apiFaqsURL;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    return this.http.get<any>(endpoint, { headers: headers });
  }

  showFAQS(id: number): Observable<any> {
    const endpoint = `${this.apiFaqsURL}/${id}`;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    return this.http.get<any>(endpoint, { headers: headers });
  }

  
  addFAQS(data: any): Observable<any> {
    const endpoint = `${this.apiFaqsURL}`;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    return this.http.post<any>(endpoint, data, { headers: headers });
  }

  updateFAQS(id: number, data: any): Observable<any> {
    const endpoint = `${this.apiFaqsURL}/${id}`;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    return this.http.put<any>(endpoint, data, { headers: headers });
  }

  deleteFAQS(id: number): Observable<any> {
    const endpoint = `${this.apiFaqsURL}/${id}`;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    return this.http.delete<any>(endpoint, { headers: headers });
  }
}
