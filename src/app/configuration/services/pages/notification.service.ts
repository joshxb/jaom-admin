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
export class NotificationService {
  base = new Base();
  auth = new AuthService(this.http, this.cookieService);

  private baseUrl = this.base.baseUrl;
  private suffixUrl = this.base.suffixUrl;

  private getCurrentNotification = `${this.baseUrl}/${this.suffixUrl}/notifications/current`;
  private deleteSpecificNotification = `${this.baseUrl}/${this.suffixUrl}/notifications/:id`;
  private baseNotification = `${this.baseUrl}/${this.suffixUrl}/notifications`;
  private checkDueDateSendNotify = `${this.baseUrl}/${this.suffixUrl}/due_date/todos`;

  constructor(private http: HttpClient, private cookieService: CookieService, private router : Router) {}

  // Function to periodically check due time
  checkDueTime(): void {
    setInterval(() => {
      this.checkDueDateNotify().subscribe((result) => {
        // Handle the result or perform any necessary actions
      });
    }, 60000);
  }

  // Function to get current user's notifications
  getCurrentUserNotifications(): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    const endpoint = this.getCurrentNotification;
    return this.http.get(endpoint, {
      headers,
    });
  }

  // Function to check due date and send notifications
  checkDueDateNotify(): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    const endpoint = this.checkDueDateSendNotify;
    return this.http.get(endpoint, {
      headers,
    });
  }

  // Function to delete a specific notification
  deleteSpecificNotifications(notification_id: number): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    const endpoint = this.deleteSpecificNotification.replace(
      ':id',
      notification_id.toString()
    );

    return this.http.delete(endpoint, {
      headers,
    });
  }

  // Function to delete all notifications
  deleteAllNotifications(): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    const endpoint = this.baseNotification;

    return this.http.delete(endpoint, {
      headers,
    });
  }

  // Function to delete all notifications
  addNewNotification(data: any): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.auth.getToken()}`
    );

    const endpoint = this.baseNotification;

    return this.http.post(endpoint, data, {
      headers,
    });
  }
}
