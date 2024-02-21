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
  // Base URL for the API calls
  base = new Base();
  // Auth service instance
  auth = new AuthService(this.http, this.cookieService);
  // Base URL for the API calls
  private baseUrl = this.base.baseUrl;
  // Suffix URL for the API calls
  private suffixUrl = this.base.suffixUrl;
  // URL for the Offer API calls
  private apiOfferUrl = `${this.baseUrl}/${this.suffixUrl}/offer`;
  // URL for the Export Offer API calls
  private apiExportOfferUrl = `${this.baseUrl}/${this.suffixUrl}/export/offer`;

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  // Method to get the Export Offer data
  getExportOffer(value: number): Observable<any> {
    // Create headers with Authorization token
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    // Return the HTTP GET request
    return this.http.get<any>(
      this.apiExportOfferUrl + `/${value}?role=admin`,
      { headers }
    );
  }

  // Method to get the Offer data
  getOffer(
    page: number,
    order: Order = Order.Null,
    items: ItemsPerPage = ItemsPerPage.Null
  ): Observable<any> {
    // Create headers with Authorization token
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    // Return the HTTP GET request
    return this.http.get<any>(
      this.apiOfferUrl +
        `?page=${page}` +
        (order !== Order.Null ? `&order=${order}` : '') +
        (items !== ItemsPerPage.Null ? `&items=${items}` : '') +
        `&role=admin`,
      { headers }
    );
  }

  // Method to delete an Offer
  deleteOffer(id: number): Observable<any> {
    // Create headers with Authorization token
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    // Return the HTTP DELETE request
    return this.http.delete<any>(this.apiOfferUrl + `/${id}?role=admin`, {
      headers,
    });
