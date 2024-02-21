import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Base } from '../../configuration.component';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class ModificationsService {
  // Initialize base and auth objects
  base = new Base();
  auth = new AuthService(this.http, this.cookieService);

  // Set baseUrl and suffixUrl using base object
  private baseUrl = this.base.baseUrl;
  private suffixUrl = this.base.suffixUrl;

  // Set apiConfigurationsUrl using baseUrl and suffixUrl
  private apiConfigurationsUrl = `${this.baseUrl}/${this.suffixUrl}/configuration`;

  // Inject HttpClient and CookieService
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  // Get configurations from the API
  getConfigurations(): Observable<any> {
    // Set headers with Authorization token
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    // Return the result of the GET request
    return this.http.get<any>(this.apiConfigurationsUrl, { headers });
  }

  // Update configurations in the API
  updateConfigurations(data: any): Observable<any> {
    // Set headers with Authorization token
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    // Return the result of the PUT request
    return this.http.put<any>(this.apiConfigurationsUrl, data, { headers });
  }
}
