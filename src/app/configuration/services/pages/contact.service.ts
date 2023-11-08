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
export class ContactService {
  base = new Base();
  auth = new AuthService(this.http, this.cookieService);
  private baseUrl = this.base.baseUrl;
  private suffixUrl = this.base.suffixUrl;
  private apiContactUrl = `${this.baseUrl}/${this.suffixUrl}/external-contacts`;
  private apiExportContactUrl = `${this.baseUrl}/${this.suffixUrl}/export/contact`;

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  getExportContacts(value: number): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    return this.http.get<any>(this.apiExportContactUrl + `/${value}?role=admin`, {
      headers,
    });
  }

  getContact(page: number, order: Order = Order.Null, items: ItemsPerPage = ItemsPerPage.Null): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    return this.http.get<any>(this.apiContactUrl + `?page=${page}` +
      (order != Order.Null ? `&order=${order}` : '') +
      (items != ItemsPerPage.Null ? `&items=${items}` : '') +
      `&role=admin`, {
      headers,
    });
  }

  deleteContact(id: number): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    return this.http.delete<any>(this.apiContactUrl + `/${id}?role=admin`, {
      headers,
    });
  }
}
