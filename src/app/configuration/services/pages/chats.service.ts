import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Base } from '../../configuration.component';
import { AuthService } from '../auth.service';
import { ImageService } from './image.service';
import { Order, ItemsPerPage } from '../../enums/order.enum';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  // Initialize base and auth objects
  base = new Base();
  auth = new AuthService(this.http, this.cookieService);
  // Set baseUrl and suffixUrl from base object
  private baseUrl = this.base.baseUrl;
  private suffixUrl = this.base.suffixUrl;
  // Set API URLs
  private apiChatUrl: string = `${this.baseUrl}/${this.suffixUrl}/conversations/all`;
  private apiMessageUrl: string = `${this.baseUrl}/${this.suffixUrl}/messages`;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private imageService: ImageService
  ) {}

  /**
   * Get all chats data with pagination, order, and items per page options
   * @param page Number representing the page number
   * @param number Number of items per page
   * @param order Order of the data (default: null)
   * @param items Items per page (default: null)
   * @returns Observable<any>
   */
  getAllChatsData(
    page: number,
    number: number,
    order: Order = Order.Null,
    items: ItemsPerPage = ItemsPerPage.Null
  ): Observable<any> {
    // Set headers with Authorization token
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );
    // Make GET request to API endpoint with query parameters
    return this.http.get<any>(
      this.apiChatUrl +
        `?page=${page}&role=admin` +
        (order != Order.Null ? `&order=${order}` : '') +
        (items != ItemsPerPage.Null ? `&items=${items}` : ''),
      { headers }
    );
  }

  /**
   * Delete a specific message by ID
   * @param id ID of the message to delete
   * @returns Observable<any>
   */
  deleteSpecificMessage(id: number): Observable<any> {
    // Set headers with Authorization token
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer
