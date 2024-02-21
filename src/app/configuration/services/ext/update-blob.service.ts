import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';
import { Base } from 'src/app/configuration/configuration.component';
import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { FileService } from '../assets/file.service';

@Injectable({
  providedIn: 'root',
})
export class UpdateBlobService {
  // Initialize base and auth objects
  base = new Base();
  auth = new AuthService(this.http, this.cookieService);
  // Define baseUrl and suffixUrl
  private baseUrl = this.base.baseUrl;
  private suffixUrl = this.base.suffixUrl;
  // Define apiUpdateBlobUrl using baseUrl and suffixUrl
  private apiUpdateBlobUrl = `${this.baseUrl}/${this.suffixUrl}/updates-blob`;

  // Constructor
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private fileService: FileService
  ) {}

  // Method to get updateBlobInfo
  getUpdateBlobInfo(updateBlobId: number): Observable<any> {
    const endpoint = this.apiUpdateBlobUrl;
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.auth.getToken()
    );

    // Return the HTTP GET request
    return this.http.get<any>(`${endpoint}/${updateBlobId}?key=info`, {
      headers: headers,
    });
  }

  // Method to get updateBlobDataFile
  getUpdateBlobDataFile(updateBlobId: number, id: number): Observable<any> {
    const endpoint = this.apiUpdateBlobUrl;
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.auth.getToken()
    );

    // Return the HTTP GET request
    return this.http
      .get(`${endpoint}/${updateBlobId}?key=blob&id=${id}`, {
        headers: headers,
        responseType: 'blob',
      })
      .pipe(
        switchMap((blob: Blob) => {
          // Return the fileService.determineBlobDataType() Observable
          return this.fileService.determineBlobDataType(blob).pipe(
            map((dataType) => {
              // Return an object containing the blob and dataType
              return { blob, dataType };
            })
          );
        })
      );
  }
}
