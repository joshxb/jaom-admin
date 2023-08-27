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
export class UsersService {
  base = new Base();
  auth = new AuthService(this.http, this.cookieService);
  private baseUrl = this.base.baseUrl;
  private suffixUrl = this.base.suffixUrl;
  private apiUserUrl = `${this.baseUrl}/${this.suffixUrl}/users`;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private imageService: ImageService
  ) {}

  getAllUserData(page: number): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );
    return this.http.get<any>(this.apiUserUrl + `?page=${page}`, { headers });
  }

  geSpecificUserData(user: number): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );
    return this.http.get<any>(this.apiUserUrl + `/${user}`, { headers });
  }

  updateOtherUserData(user : number, formData : any) {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );
    return this.http.put<any>(this.apiUserUrl + `/${user}?role=admin`, formData, { headers });
  }

  deleteSpecificUser(user: number): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );
    return this.http.delete<any>(this.apiUserUrl + `/${user}?role=admin`, { headers });
  }

  updateOtherUserImageData(imageData: any, userId: number): Observable<any> {
    return this.imageService.updateOtherUserImageData(imageData, userId);
  }
}
