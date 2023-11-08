import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Base } from '../../configuration.component';
import { AuthService } from '../auth.service';
import { Order, ItemsPerPage } from '../../enums/order.enum';

@Injectable({
  providedIn: 'root',
})
export class OfferService {
  base = new Base();
  auth = new AuthService(this.http, this.cookieService);
  private baseUrl = this.base.baseUrl;
  private suffixUrl = this.base.suffixUrl;
  private apiOfferUrl = `${this.baseUrl}/${this.suffixUrl}/offer`;
  private apiExportOfferUrl = `${this.baseUrl}/${this.suffixUrl}/export/offer`;

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  getExportOffer(value: number): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    return this.http.get<any>(this.apiExportOfferUrl + `/${value}?role=admin`, {
      headers,
    });
  }

  getOffer(page: number, order: Order = Order.Null, items: ItemsPerPage = ItemsPerPage.Null): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    return this.http.get<any>(this.apiOfferUrl +
      `?page=${page}` +
      (order !== Order.Null ? `&order=${order}` : '') +
      (items !== ItemsPerPage.Null ? `&items=${items}` : '')
      + `&role=admin`, {
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
