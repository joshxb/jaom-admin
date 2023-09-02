import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageVisitService } from '../pages/page-visit.service';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  constructor(private pageVisitService: PageVisitService) {}

  getPageVisits(
    page: number,
    selectedMonth: string,
    selectedYear: number
  ): Observable<any> {
    return this.pageVisitService.getPageVisits(
      page,
      selectedMonth,
      selectedYear
    );
  }

  deleteAnalytics(id: number): Observable<any> {
    return this.pageVisitService.deleteAnalytics(id);
  }
}
