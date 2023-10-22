import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContactService } from '../pages/contact.service';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  constructor(
    private contactService: ContactService
  ) {}

  getExportContacts(value: number): Observable<any> {
    return this.contactService.getExportContacts(value);
  }

  getContact(page: number): Observable<any> {
    return this.contactService.getContact(page);
  }

  deleteContact(id: number): Observable<any> {
    return this.contactService.deleteContact(id);
  }
}
