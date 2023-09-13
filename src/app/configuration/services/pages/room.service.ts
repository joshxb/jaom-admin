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

  private apiRoomUrl = `${this.baseUrl}/${this.suffixUrl}/group_chats`;
  private apiRoomChatsUrl = `${this.baseUrl}/${this.suffixUrl}/group_messages`;

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  addGroupChat(
    groupChatName: string,
    userIds: number[],
    image: File
  ): Observable<any> {
    const endpoint = this.apiRoomUrl;

    const formData: FormData = new FormData();
    formData.append('name', groupChatName);
    formData.append('user_ids', JSON.stringify([]));
    formData.append('image', image);

    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.auth.getToken()
    ); // Replace with your authentication mechanism
    return this.http.post<any>(endpoint, formData, { headers: headers });
  }

  getRoomCounts(): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    return this.http.get<any>(`${this.apiRoomUrl}/count`, { headers });
  }

  getRoomList(page: number, type: string): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    let url = null;
    if (type === 'default') {
      url = `${this.apiRoomUrl}?page=${page}&default=true`;
    } else {
      url = `${this.apiRoomUrl}?page=${page}`;
    }

    return this.http.get<any>(url, { headers });
  }

  getRoomChatList(page: number): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    return this.http.get<any>(`${this.apiRoomChatsUrl}?page=${page}`, {
      headers,
    });
  }

  deleteRoom(id: number): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    return this.http.delete<any>(`${this.apiRoomUrl}/${id}?role=admin`, {
      headers,
    });
  }

  deleteSpecificRoomChat(id: number): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    return this.http.delete<any>(
      `${this.apiRoomUrl}/${id}?role=admin`,
      { headers }
    );
  }

  updateSpecificGroupChat(
    groupChatId: number,
    groupChatName: string
  ): Observable<any> {
    const endpoint = `${this.apiRoomUrl}/${groupChatId}?role=admin`;
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.auth.getToken()
    );
    const body = { name: groupChatName }; 
    return this.http.put<any>(endpoint, body, { headers: headers });
  }

}
