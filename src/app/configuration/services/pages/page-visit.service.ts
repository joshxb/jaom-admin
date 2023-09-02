import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Base } from '../../configuration.component';
import { AuthService } from '../auth.service';
import { ImageService } from './image.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable({
  providedIn: 'root',
})
export class PageVisitService {
  base = new Base();
  auth = new AuthService(this.http, this.cookieService);
  private baseUrl = this.base.baseUrl;
  private suffixUrl = this.base.suffixUrl;
  private apiPageAnalyticsUrl = `${this.baseUrl}/${this.suffixUrl}/page-analytics`;

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  getPageVisits(
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
      this.apiPageAnalyticsUrl +
        `?page=${page}&month=${selectedMonth}&year=${selectedYear}`,
      { headers }
    );
  }

  deleteAnalytics(
    id: number
  ): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    //params = ?page=1&month=july&year=2023
    return this.http.delete<any>(
      this.apiPageAnalyticsUrl +
        `/${id}`,
      { headers }
    );
  }
}
