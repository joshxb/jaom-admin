import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageVisitService } from '../pages/page-visit.service';
import { ItemsPerPage, Order } from '../../enums/order.enum';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  constructor(private pageVisitService: PageVisitService) {}

  getPageVisits(
    page: number,
    selectedMonth: string,
    selectedYear: number,
    order: Order = Order.Null, 
    items: ItemsPerPage = ItemsPerPage.Null
  ): Observable<any> {
    return this.pageVisitService.getPageVisits(
      page,
      selectedMonth,
      selectedYear,
      order,
      items
    );
  }

  deleteAnalytics(id: number): Observable<any> {
    return this.pageVisitService.deleteAnalytics(id);
  }
}
