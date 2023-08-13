import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Base } from '../configuration.component';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ConversationService {
  base = new Base();
  auth = new AuthService(this.http, this.cookieService);
  private baseUrl = this.base.baseUrl;
  private suffixUrl = this.base.suffixUrl;

  private apiChatUrl = `${this.baseUrl}/${this.suffixUrl}/conversations/count`;

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  getChatCounts(): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );
    
    return this.http.get<any>(
      this.apiChatUrl,
      { headers }
    );
  }
}
