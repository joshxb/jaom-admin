import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageVisitService } from '../pages/page-visit.service';
import { ModicationsService } from '../pages/modifications.service';

@Injectable({
  providedIn: 'root',
})
export class ModificationsService {
  constructor(private modicationsService: ModicationsService) {}

  getConfigurations(): Observable<any> {
    return this.modicationsService.getConfigurations();
  }

  updateConfigurations(data: any): Observable<any> {
    return this.modicationsService.updateConfigurations(data);
  }
}
