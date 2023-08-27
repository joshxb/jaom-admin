import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Base } from '../../configuration.component';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class UpdatesService {
  base = new Base();
  auth = new AuthService(this.http, this.cookieService);
  private baseUrl = this.base.baseUrl;
  private suffixUrl = this.base.suffixUrl;

  private apiUpdateUrl = `${this.baseUrl}/${this.suffixUrl}/updates`;

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  getUpdatesCounts(): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    return this.http.get<any>(`${this.apiUpdateUrl}/count`, { headers });
  }

  getAllUpdates(page: number): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    return this.http.get<any>(`${this.apiUpdateUrl}?page=${page}&role=admin`, { headers });
  }

  deleteSpecificUpdate(id: number): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    return this.http.delete<any>(
      `${this.apiUpdateUrl}/${id}/current_user?role=admin`,
      { headers }
    );
  }

  updatePermission(data: any, id: number): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    return this.http.put<any>(
      `${this.apiUpdateUrl}/${id}/permission?role=admin`,
      data,
      { headers }
    );
  }
}
