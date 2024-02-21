import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageVisitService } from '../pages/page-visit.service';
import { ItemsPerPage, Order } from '../../enums/order.enum';

/*
* Analytics Service is responsible for fetching and deleting analytics data.
* It uses the PageVisitService to make HTTP requests to the server.
*/
@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  // Inject PageVisitService for making HTTP requests
  constructor(private pageVisitService: PageVisitService) {}

  /*
  * getPageVisits method is used to fetch analytics data for a given page, month, and year.
  * It accepts optional parameters for sorting order and number of items per page.
  * It returns an Observable of any type, which will emit the fetched data when it arrives.
  */
  getPageVisits(
    page: number,
    selectedMonth: string,
    selectedYear: number,
    order: Order = Order.Null, 
    items: ItemsPerPage = ItemsPerPage.Null
  ): Observable<any> {
    // Delegate the HTTP request to PageVisitService
    return this.pageVisitService.getPageVisits(
      page,
      selectedMonth,
      selectedYear,
   ,   order,
      items
    );
  }

  /*
  * deleteAnalytics method is used to delete analytics data for a given id.
  * It returns an Observable of any type, which will emit the result of the deletion operation.
  */
  deleteAnalytics(id: number): Observable<any> {
    // Delegate the HTTP request to PageVisitService
    return this.pageVisitService.deleteAnalytics(id);
  }
}
