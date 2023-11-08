import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Base } from 'src/app/configuration/configuration.component';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Order, ItemsPerPage } from '../../enums/order.enum';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  base = new Base();
  auth = new AuthService(this.http, this.cookieService);
  private baseUrl = this.base.baseUrl;
  private suffixUrl = this.base.suffixUrl;

  private apiFeedbacksUrl = `${this.baseUrl}/${this.suffixUrl}/feedbacks`;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router
  ) { }

  getFeedbacks(page: number, order: Order = Order.Null, items: ItemsPerPage = ItemsPerPage.Null): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    return this.http.get<any>(`${this.apiFeedbacksUrl}?page=${page}` +
      (order != Order.Null ? `&order=${order}` : '') +
      (items != ItemsPerPage.Null ? `&items=${items}` : ''), {
      headers,
    });
  }

  addResponseFeedback(id: number, data: any): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    return this.http.put<any>(`${this.apiFeedbacksUrl}/${id}`, data, {
      headers,
    });
  }

  deleteFeedback(id: number): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    return this.http.delete<any>(`${this.apiFeedbacksUrl}/${id}`, {
      headers,
    });
  }
}
