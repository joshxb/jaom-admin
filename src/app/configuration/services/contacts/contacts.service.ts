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

  getContact(page: number): Observable<any> {
    return this.contactService.getContact(page);
  }

  deleteContact(id: number): Observable<any> {
    return this.contactService.deleteContact(id);
  }
}
