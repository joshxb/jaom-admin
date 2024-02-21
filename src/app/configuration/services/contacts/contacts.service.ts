import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContactService } from '../pages/contact.service'; // Import the ContactService
import { 
  ItemsPerPage, 
  Order 
} from '../../../enums/order.enum'; // Import the order enumeration

@Injectable({
  providedIn: 'root' // Provide this service at the root level
})
export class ContactsService {
  // Inject the ContactService into this service
  constructor(
    private contactService: ContactService
  ) {}

  // Get export contacts from the server
  getExportContacts(value: any, page: number = 1): Observable<any> {
    return this.contactService.getExportContacts(value, page);
  }

  // Get contacts from the server
  getContact(page: number = 1, order: Order = Order.Null, items: ItemsPerPage = ItemsPerPage.Null): Observable<any> {
    return this.contactService.getContact(page, order, items);
  }

  // Delete a contact from the server
  deleteContact(id: number): Observable<any> {
    return this.contactService.deleteContact(id);
  }
}
