import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Base } from 'src/app/configuration/configuration.component';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  base = new Base();
  auth = new AuthService(this.http, this.cookieService);
  private baseUrl = this.base.baseUrl;
  private suffixUrl = this.base.suffixUrl;

  private apiUploadUserImageUrl = `${this.baseUrl}/${this.suffixUrl}/user-image`;

  constructor(private http: HttpClient, private cookieService: CookieService, private router : Router) {}

  updateOtherUserImageData(imageData: any, userId : number): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    return this.http.post<any>(this.apiUploadUserImageUrl + `/${userId}/update?role=admin`, imageData, {
      headers,
    });
  }
}
