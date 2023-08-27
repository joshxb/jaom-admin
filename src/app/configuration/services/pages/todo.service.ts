import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Base } from '../../configuration.component';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  base = new Base();
  auth = new AuthService(this.http, this.cookieService);
  private baseUrl = this.base.baseUrl;
  private suffixUrl = this.base.suffixUrl;
  private apiTodoUrl = `${this.baseUrl}/${this.suffixUrl}/todos`;
  private apiTodoV2Url = `${this.baseUrl}/${this.suffixUrl}/v2/todos`;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
  ) {}

  getAllTodoData(page: number): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );
    return this.http.get<any>(this.apiTodoV2Url + `?page=${page}&role=admin`, { headers });
  }

  deleteSpecificTodo(id: number): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );
    return this.http.delete<any>(this.apiTodoUrl + `/${id}?role=admin`, { headers });
  }
}
