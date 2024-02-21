import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Base } from '../../configuration.component';
import { AuthService } from '../auth.service';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { ImageService } from '../../assets/image.service';
import { ItemsPerPage, Order } from '../../enums/order.enum';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  // Initialize the base and auth objects
  base = new Base();
  auth = new AuthService(this.http, this.cookieService);
  private baseUrl = this.base.baseUrl;
  private suffixUrl = this.base.suffixUrl;

  // Define the API endpoints
  private apiRoomUrl = `${this.baseUrl}/${this.suffixUrl}/group_chats`;
  private apiRoomChatsUrl = `${this.baseUrl}/${this.suffixUrl}/group_messages`;
  private apiRoomImageUpdateUrl = `${this.baseUrl}/${this.suffixUrl}/group-image/update`;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private imageService: ImageService
  ) {}

  // Add a group chat
  addGroupChat(
    groupChatName: string,
    userIds: number[],
    image: File
  ): Observable<any> {
    const endpoint = this.apiRoomUrl;

    const formData: FormData = new FormData();
    formData.append('name', groupChatName);
    formData.append('user_ids', JSON.stringify(userIds));
    formData.append('image', image);

    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.auth.getToken()
    ); // Replace with your authentication mechanism
    return this.http.post<any>(endpoint, formData, { headers });
  }

  // Get the count of group chats
  getRoomCounts(): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    return this.http.get<any>(`${this.apiRoomUrl}/count`, { headers });
  }

  // Get the list of group chats
  getRoomList(
    page: number,
    type: string,
    order: Order = Order.Null,
    items: ItemsPerPage = ItemsPerPage.Null
  ): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    let url = null;
    if (type === 'default') {
      url = `${this.apiRoomUrl}?page=${page}&default=true`;
    } else if (type === 'v2') {
      url = `${this.apiRoomUrl}?page=${page}&v2=true`;
    } else {
      url = `${this.apiRoomUrl}?page=${page}`;
    }

    if (order != Order.Null) {
      url += `&order=${order}`;
    }

    if (items != ItemsPerPage.Null) {
      url += `&items=${items}`;
    }

    return this.http.get<any>(url, { headers });
  }

  // Get the list of messages in a group chat
  getRoomChatList(
    page: number,
    order: Order = Order.Null,
    items: ItemsPerPage = ItemsPerPage.Null
  ): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    return this.http.get<any>(
      this.apiRoomChatsUrl + `?page=${page}` +
      (order != Order.Null ? `&order=${order}` : '') +
      (items != ItemsPerPage.Null ? `&items=${items}` : ''),
      { headers }
    );
  }

  // Delete a group chat
  deleteRoom(id: number): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    return this.http.delete<any>(`${this.apiRoomUrl}/${id}?role=admin`, {
      headers,
    });
  }

  // Clear the messages in a group chat
  clearChatRoom(group_id: number): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    return this.http.delete<any>(`${this.apiRoomChatsUrl}/${group_id}`, {
      headers,
    });
  }

  // Delete a specific message in a group chat
  deleteSpecificRoomChat(id: number): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    return this.http.delete<any>(
      `${this.apiRoomChatsUrl}/v2/${id}?role=admin`,
      { headers }
    );
  }

  // Update the name and image of a specific group chat
  updateSpecificGroupChat(
    groupChatId: number,
    groupChatName: string,
    image: any
  ): Observable<any> {
    const endpoint = `${this.apiRoomUrl}/v2/${groupChatId}`;
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.auth.getToken()
    );

    if (image) {
      this.updateGroupChatImage(groupChatId, image).subscribe((res) => { });
    }
