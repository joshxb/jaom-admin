import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Base } from '../../configuration.component';
import { AuthService } from '../auth.service';
import { ItemsPerPage, Order } from '../../enums/order.enum';

@Injectable({
  providedIn: 'root',
})
export class DonationService {
  base = new Base();
  auth = new AuthService(this.http, this.cookieService);
  private baseUrl = this.base.baseUrl;
  private suffixUrl = this.base.suffixUrl;

  private apiDonationUrl = `${this.baseUrl}/${this.suffixUrl}/transactions/donate`;
  private apiExportDonationUrl = `${this.baseUrl}/${this.suffixUrl}/export/donation`;

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  getExportDonations(value: number): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    return this.http.get<any>(this.apiExportDonationUrl + `/${value}?role=admin`, {
      headers,
    });
  }

  getDonationTransactions(
    page: number,
    selectedMonth: string,
    selectedYear: number
  ): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    //params = ?page=1&month=july&year=2023
    return this.http.get<any>(
      this.apiDonationUrl +
      `?page=${page}&month=${selectedMonth}&year=${selectedYear}`,
      { headers }
    );
  }

  getAllPaginatedDonationTransactions(page: number, order: Order = Order.Null, items: ItemsPerPage = ItemsPerPage.Null): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    return this.http.get<any>(
      this.apiDonationUrl + `/all?page=${page}` +
      (order !== Order.Null ? `&order=${order}` : '') +
      (items !== ItemsPerPage.Null ? `&items=${items}` : '') +
      `&role=admin`, { headers }
    );
  }

  deleteDonationTransaction(id: number): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    return this.http.delete<any>(this.apiDonationUrl + `/${id}?role=admin`, {
      headers,
    });
  }
}
