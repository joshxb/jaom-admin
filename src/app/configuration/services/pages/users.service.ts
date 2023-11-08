import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Base } from '../../configuration.component';
import { AuthService } from '../auth.service';
import { ImageService } from './image.service';
import { ItemsPerPage, Order } from '../../enums/order.enum';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  base = new Base();
  auth = new AuthService(this.http, this.cookieService);
  private baseUrl = this.base.baseUrl;
  private suffixUrl = this.base.suffixUrl;
  private apiUserUrl = `${this.baseUrl}/${this.suffixUrl}/users`;
  private apiSearchUsersUrl = `${this.baseUrl}/${this.suffixUrl}/search-users?search=:name&range=:index`;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private imageService: ImageService
  ) {}

  getAllUserData(page: number, request: any = null, order: Order = Order.Null, items: ItemsPerPage = ItemsPerPage.Null): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    return this.http.get<any>(
      this.apiUserUrl +
        `?page=${page}` +
        (request != null ? `&${request}=true` : '') +
        (order != Order.Null ? `&order=${order}` : '') +
        (items != ItemsPerPage.Null ? `&items=${items}` : ''),
      { headers }
    );
  }

  geSpecificUserData(user: number, request: any = null): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );
    return this.http.get<any>(this.apiUserUrl + `/${user}${request != null ? '?' + request + '=' + true : ''}`, { headers });
  }

  updateOtherUserData(user : number, formData : any) {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );
    return this.http.put<any>(this.apiUserUrl + `/${user}?role=admin`, formData, { headers });
  }

  deleteSpecificUser(user: number): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );
    return this.http.delete<any>(this.apiUserUrl + `/${user}?role=admin`, { headers });
  }

  updateOtherUserImageData(imageData: any, userId: number): Observable<any> {
    return this.imageService.updateOtherUserImageData(imageData, userId);
  }

  searchUser(name: any, index: number, type: string = ''): Observable<any> {
    const endpoint = this.apiSearchUsersUrl
      .replace(':name', name.toString())
      .replace(':index', index.toString());
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.auth.getToken()
    ); // Replace with your authentication mechanism

    const url = type !== '' ? `${endpoint}&type=${type}` : `${endpoint}`;
    return this.http.get<any>(url, { headers: headers });
  }

  adminAccessUsers(): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );
    return this.http.get<any>(`${this.apiUserUrl}/administrative-access`, { headers });
  }
}
