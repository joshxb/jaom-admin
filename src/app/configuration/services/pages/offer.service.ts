import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Base } from '../../configuration.component';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class OfferService {
  base = new Base();
  auth = new AuthService(this.http, this.cookieService);
  private baseUrl = this.base.baseUrl;
  private suffixUrl = this.base.suffixUrl;
  private apiOfferUrl = `${this.baseUrl}/${this.suffixUrl}/offer`;

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  getOffer(page: number): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    return this.http.get<any>(this.apiOfferUrl + `?page=${page}&role=admin`, {
      headers,
    });
  }

  deleteOffer(id: number): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    return this.http.delete<any>(this.apiOfferUrl + `/${id}?role=admin`, {
      headers,
    });
  }
}
