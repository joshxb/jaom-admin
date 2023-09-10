import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FeedbackService } from '../pages/feedback.service';
import { NotificationService } from '../pages/notification.service';

@Injectable({
  providedIn: 'root',
})
export class ConcernService {
  constructor(
    private http: HttpClient,
    private feedbacksService: FeedbackService,
    private notificationService: NotificationService
  ) {}

  getFeedbacks(page: number): Observable<any> {
    return this.feedbacksService.getFeedbacks(page);
  }

  addResponseFeedback(id: number, data: any): Observable<any> {
    return this.feedbacksService.addResponseFeedback(id, data);
  }

  deleteFeedback(id: number): Observable<any> {
    return this.feedbacksService.deleteFeedback(id);
  }

  addNewNotification(data: any): Observable<any> {
    return this.notificationService.addNewNotification(data);
  }
}
