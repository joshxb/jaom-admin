import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Base } from '../../configuration.component';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  base = new Base();
  auth = new AuthService(this.http, this.cookieService);
  private baseUrl = this.base.baseUrl;
  private suffixUrl = this.base.suffixUrl;

  private apiRoomtUrl = `${this.baseUrl}/${this.suffixUrl}/group_chats`;
  private apiRoomChatsUrl = `${this.baseUrl}/${this.suffixUrl}/group_messages`;

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  getRoomCounts(): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    return this.http.get<any>(
      `${this.apiRoomtUrl}/count`,
      { headers }
    );
  }

  getRoomList(page : number): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    return this.http.get<any>(
      `${this.apiRoomtUrl}?page=${page}`,
      { headers }
    );
  }

  getRoomChatList(page : number): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    return this.http.get<any>(
      `${this.apiRoomChatsUrl}?page=${page}`,
      { headers }
    );
  }

  deleteRoom(id : number): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    return this.http.delete<any>(
      `${this.apiRoomtUrl}/${id}?role=admin`,
      { headers }
    );
  }


  deleteSpecificRoomChat(id : number): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    return this.http.delete<any>(
      `${this.apiRoomChatsUrl}/v2/${id}?role=admin`,
      { headers }
    );
  }
}
