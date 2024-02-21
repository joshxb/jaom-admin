import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageVisitService } from '../pages/page-visit.service';
import { ModicationsService } from './pages/modifications.service';
import { FaqsService } from '../pages/faqs.service';

@Injectable({
  providedIn: 'root',
})
export class ModificationsService {
  // Inject the ModicationsService and FaqsService for use in this service
  constructor(
    private modificationsService: ModicationsService,
    private faqsService: FaqsService
  ) {}

  // Get configurations from the ModicationsService
  getConfigurations(): Observable<any> {
    return this.modificationsService.getConfigurations();
  }

  // Update configurations in the ModicationsService
  updateConfigurations(data: any): Observable<any> {
    return this.modificationsService.updateConfigurations(data);
  }

  // Show all FAQs from the FaqsService
  showAllFAQS(): Observable<any> {
    return this.faqsService.showAllFAQS();
  }

  // Show a specific FAQ by id from the FaqsService
  showFAQS(id: number): Observable<any> {
    return this.faqsService.showFAQS(id);
  }

  // Add a new FAQ to the FaqsService
  addFAQS(data: any): Observable<any> {
    return this.faqsService.addFAQS(data);
  }

  // Update a specific FAQ by id in the FaqsService
  updateFAQS(id: number, data: any): Observable<any> {
    return this.faqsService.updateFAQS(id, data);
  }

  // Delete a specific FAQ by id from the FaqsService
  deleteFAQS(id: number): Observable<any> {
    return this.faqsService.deleteFAQS(id);
  }
}
