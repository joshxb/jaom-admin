import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Base } from '../../configuration.component';
import { AuthService } from '../auth.service';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { ImageService } from '../../assets/image.service';

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
  private apiRoomImageUpdateUrl = `${this.baseUrl}/${this.suffixUrl}/group-image/update`;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private imageService: ImageService
  ) {}

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

    return this.http.delete<any>(`${this.apiRoomChatsUrl}/v2/${id}?role=admin`, {
      headers,
    });
  }

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
      this.updateGroupChatImage(groupChatId, image).subscribe((res) => {});
    }

    const body = { name: groupChatName };
    return this.http.put<any>(endpoint, body, { headers: headers });
  }

  updateGroupChatImage(id: number, file: any): Observable<any> {
    const endpoint = `${this.apiRoomImageUpdateUrl}?groupId=${id}&role=admin`;
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.auth.getToken()
    );

    return this.imageService.compressImage(file).pipe(
      switchMap((compressedImage: File) => {
        const compressedFile = new File(
          [compressedImage],
          compressedImage.name,
          {
            type: compressedImage.type,
          }
        );

        const formData: FormData = new FormData();
        formData.append('image', compressedFile);

        return this.http.post<any>(endpoint, formData, { headers: headers });
      })
    );
  }
}
