import { Injectable } from '@angular/core';
// Import HttpClient and HttpHeaders from '@angular/common/http' for making HTTP requests
import { HttpClient, HttpHeaders } from '@angular/common/http';
// Import Observable for handling asynchronous operations
import { Observable } from 'rxjs';
// Import CookieService from 'ngx-cookie-service' for managing cookies
import { CookieService } from 'ngx-cookie-service';
// Import Base class from '../../configuration.component'
import { Base } from '../../configuration.component';
// Import AuthService from '../auth.service' for handling authentication-related tasks
import { AuthService } from '../auth.service';

@Injectable({
  // Specify that the ConversationalService should be provided in the root injector
  providedIn: 'root',
})
export class ConversationalService {
  // Initialize the base URL and suffix URL using the Base class
  base = new Base();
  auth = new AuthService(this.http, this.cookieService);
  private baseUrl = this.base.baseUrl;
  private suffixUrl = this.base.suffixUrl;

  // Define the API chat URL using the base URL and suffix URL
  private apiChatUrl = `${this.baseUrl}/${this.suffixUrl}/conversations/count`;

  // Inject HttpClient and CookieService in the constructor
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  // Define the getChatCounts() method to get the chat counts from the API
  getChatCounts(): Observable<any> {
    // Create HttpHeaders object and set the Authorization header with the token from AuthService
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    // Make a GET request to the API chat URL with the headers
    return this.http.get<any>(this.apiChatUrl, { headers });
  }
}
