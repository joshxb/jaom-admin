import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Base } from '../../configuration.component';
import { AuthService } from '../auth.service';
import { ImageService } from './image.service';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  base = new Base();
  auth = new AuthService(this.http, this.cookieService);
  private baseUrl = this.base.baseUrl;
  private suffixUrl = this.base.suffixUrl;
  private apiChatUrl = `${this.baseUrl}/${this.suffixUrl}/conversations/all`;
  private apiMessageUrl = `${this.baseUrl}/${this.suffixUrl}/messages`;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private imageService: ImageService
  ) {}

  getAllChatsData(page: number): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );
    return this.http.get<any>(this.apiChatUrl + `?page=${page}&role=admin`, { headers });
  }

  deleteSpecificMessage(id: number): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );
    return this.http.delete<any>(this.apiMessageUrl + `/${id}?role=admin`, { headers });
  }
}
