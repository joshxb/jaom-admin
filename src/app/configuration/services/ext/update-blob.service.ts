import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';
import { Base } from 'src/app/configuration/configuration.component';
import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { FileService } from '../../assets/file.service';

@Injectable({
    providedIn: 'root',
})
export class UpdateBlobService {
    base = new Base();
    auth = new AuthService(this.http, this.cookieService);
    private baseUrl = this.base.baseUrl;
    private suffixUrl = this.base.suffixUrl;

    private apiUpdateBlobUrl = `${this.baseUrl}/${this.suffixUrl}/updates-blob`;

    constructor(
        private http: HttpClient,
        private cookieService: CookieService,
        private fileService: FileService
    ) { }

    getUpdateBlobInfo(updateBlobId: number): Observable<any> {
        const endpoint = this.apiUpdateBlobUrl;
        const headers = new HttpHeaders().set(
            'Authorization',
            'Bearer ' + this.auth.getToken()
        );

        return this.http.get<any>(`${endpoint}/${updateBlobId}?key=info`, {
            headers: headers,
        });
    }

    getUpdateBlobDataFile(updateBlobId: number, id: number): Observable<any> {
        const endpoint = this.apiUpdateBlobUrl;
        const headers = new HttpHeaders().set(
            'Authorization',
            'Bearer ' + this.auth.getToken()
        );

        return this.http
            .get(`${endpoint}/${updateBlobId}?key=blob&id=${id}`, {
                headers: headers,
                responseType: 'blob',
            })
            .pipe(
                switchMap((blob: Blob) => {
                    return this.fileService.determineBlobDataType(blob).pipe(
                        map((dataType) => {
                            return { blob, dataType };
                        })
                    );
                })
            );
    }
}
