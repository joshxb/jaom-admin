import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Base, Redirects } from '../../configuration.component';
import { AuthService } from '../auth.service';
import { CookieService } from 'ngx-cookie-service';
import { ItemsPerPage, Order } from '../../enums/order.enum';

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
  private apiServerConfigUrl = `${this.baseUrl}/${this.suffixUrl}/sys_config/server_info`;

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  getUserData(): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );
    return this.http.get<any>(this.apiUserUrl, { headers });
  }

  updateOtherUserData(user: number, formData: any) {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );
    return this.http.put<any>(this.apiUserUrl + `s/${user}`, formData, { headers });
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

  getUserHistoryData(page: number, order: Order = Order.Null, items: ItemsPerPage = ItemsPerPage.Null): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );
    return this.http.get<any>(
      `${this.apiUserHistoryUrl}/all?page=${page}` +
      `${order !== Order.Null ? `&order=${order}` : ''}` +
      `${items !== ItemsPerPage.Null ? `&items=${items}` : ''}`,
      { headers });
  }

  deleteUserHistory(id: number): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );
    return this.http.delete<any>(`${this.apiUserHistoryUrl}/${id}`, { headers });
  }

  getServerConfiguration(key: ServerConfParams, table: string = ''): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );
    const apiUrl = `${this.apiServerConfigUrl}?key=${key}${key === ServerConfParams.ColumnData ? `&table=${table}` : ''}`;

    return this.http.get<any>(apiUrl, { headers });
  }
}

enum ServerConfParams {
  SysDataConf = 'sys_data_conf',
  ColumnData = 'column_data',
}

export default ServerConfParams;
