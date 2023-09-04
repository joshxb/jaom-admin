import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageVisitService } from '../pages/page-visit.service';
import { ModicationsService } from '../pages/modifications.service';
import { FaqsService } from '../pages/faqs.service';

@Injectable({
  providedIn: 'root',
})
export class ModificationsService {
  constructor(
    private modicationsService: ModicationsService,
    private faqsService: FaqsService
  ) {}

  getConfigurations(): Observable<any> {
    return this.modicationsService.getConfigurations();
  }

  updateConfigurations(data: any): Observable<any> {
    return this.modicationsService.updateConfigurations(data);
  }

  showAllFAQS(): Observable<any> {
    return this.faqsService.showAllFAQS();
  }

  showFAQS(id: number): Observable<any> {
    return this.faqsService.showFAQS(id);
  }

  addFAQS(data: any): Observable<any> {
    return this.faqsService.addFAQS(data);
  }

  updateFAQS(id: number, data: any): Observable<any> {
    return this.faqsService.updateFAQS(id, data);
  }

  deleteFAQS(id: number): Observable<any> {
    return this.faqsService.deleteFAQS(id);
  }
}
