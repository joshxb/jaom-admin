import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FeedbackService } from '../pages/feedback.service';
import { NotificationService } from '../pages/notification.service';
import { ItemsPerPage, Order } from '../../enums/order.enum';

@Injectable({
  providedIn: 'root',
})
export class ConcernService {
  constructor(
    private http: HttpClient,
    private feedbacksService: FeedbackService,
    private notificationService: NotificationService
  ) {}

  getFeedbacks(page: number, order: Order = Order.Null, items: ItemsPerPage = ItemsPerPage.Null): Observable<any> {
    return this.feedbacksService.getFeedbacks(page, order, items);
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
